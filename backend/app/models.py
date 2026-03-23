from pydantic import BaseModel
from typing import List, Optional

class Valve(BaseModel):
    id: int
    name: Optional[str] = None
    gpio: int
    is_input: Optional[bool] = False
    enabled: Optional[bool] = True
    active: str

class Schedule(BaseModel):
    id: Optional[str] = None
    name: str
    valve_ids: List[int]
    rain_sensor_id: Optional[int] = None
    routine: str
    start_time: str
    rounds: int
    duration: int
    round_delay: int = 5

class RunCommand(BaseModel):
    valves: Optional[List[int]] = None
    duration: Optional[int] = 900
    rounds: Optional[int] = 2
