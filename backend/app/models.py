from pydantic import BaseModel
from typing import List, Optional

class Valve(BaseModel):
    id: int
    gpio: int
    active: str
    name: Optional[str] = None
    master: Optional[bool] = False
    enabled: Optional[bool] = True
    filterCleanup: Optional[bool] = False

class Schedule(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = None
    valve_ids: List[int]
    duration: int
    routine: str
    start_time: str
    rounds: int

class RunCommand(BaseModel):
    valves: Optional[List[int]] = None
    duration: Optional[int] = 900
    rounds: Optional[int] = 2
