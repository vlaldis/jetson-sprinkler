from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import os

from app import models, auth, storage
from app.scheduler.manager import start_scheduler, stop_scheduler, reload_jobs, run_sprinkler_routine

app = FastAPI(title="Sprinkler Control API")

# Configure CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- Authentication Configuration ---
ADMIN_USER = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASS = os.environ.get("ADMIN_PASSWORD", "admin")
HASHED_PASS = auth.get_password_hash(ADMIN_PASS)

fake_users_db = {
    ADMIN_USER: {
        "username": ADMIN_USER,
        "hashed_password": HASHED_PASS
    }
}

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = auth.TokenData(username=username)
    except auth.JWTError:
        raise credentials_exception
    
    user = fake_users_db.get(token_data.username)
    if user is None:
        raise credentials_exception
    return auth.UserInDB(**user)

# --- Lifespan Events ---
@app.on_event("startup")
async def startup_event():
    start_scheduler()

@app.on_event("shutdown")
async def shutdown_event():
    stop_scheduler()

# --- Routes ---
@app.post("/token", response_model=auth.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user_dict = fake_users_db.get(form_data.username)
    if not user_dict:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    user = auth.UserInDB(**user_dict)
    if not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token_expires = auth.timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/valves", response_model=List[models.Valve])
async def get_valves(current_user: auth.UserInDB = Depends(get_current_user)):
    return storage.get_valves()

@app.post("/api/valves")
async def update_valves(valves: List[models.Valve], current_user: auth.UserInDB = Depends(get_current_user)):
    valves_dict = [v.dict(exclude_none=True) for v in valves]
    storage.save_valves(valves_dict)
    return {"status": "success", "message": "Valves updated successfully"}

@app.get("/api/schedules", response_model=List[models.Schedule])
async def get_schedules(current_user: auth.UserInDB = Depends(get_current_user)):
    return storage.get_schedules()

@app.post("/api/schedules")
async def update_schedules(schedules: List[models.Schedule], current_user: auth.UserInDB = Depends(get_current_user)):
    schedules_dict = [s.dict(exclude_none=True) for s in schedules]
    storage.save_schedules(schedules_dict)
    # Reload APScheduler jobs when schedules are updated
    reload_jobs()
    return {"status": "success", "message": "Schedules updated successfully"}

@app.post("/api/run")
async def run_sprinkler(command: models.RunCommand, current_user: auth.UserInDB = Depends(get_current_user)):
    run_sprinkler_routine(
        valve_ids=command.valves,
        duration=command.duration,
        rounds=command.rounds
    )
    return {"status": "success", "message": "Sprinkler routine started."}
