from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal

class BuildingBase(BaseModel):
    name: str
    address: Optional[str] = None
    area: Optional[Decimal] = None

class BuildingCreate(BuildingBase):
    pass

class BuildingRead(BuildingBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class RoomBase(BaseModel):
    name: str
    area: Optional[Decimal] = None
    room_type: Optional[str] = None

class RoomCreate(RoomBase):
    building_id: int

class RoomRead(RoomBase):
    id: int
    building_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ConsumerBase(BaseModel):
    name: str
    consumer_type: Optional[str] = None
    nominal_power: Decimal

class ConsumerCreate(ConsumerBase):
    room_id: int

class ConsumerRead(ConsumerBase):
    id: int
    room_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ScenarioBase(BaseModel):
    name: str
    description: Optional[str] = None
    consumption_factor: Decimal = Decimal("1.0")

class ScenarioCreate(ScenarioBase):
    pass

class ScenarioRead(ScenarioBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class SimulationCreate(BaseModel):
    scenario_id: int
    duration: int
    time_step: int

class SimulationRead(BaseModel):
    id: int
    scenario_id: int
    start_time: datetime
    duration: int
    time_step: int

    class Config:
        from_attributes = True

class SimulationResultRead(BaseModel):
    timestamp: datetime
    energy_value: Decimal

    class Config:
        from_attributes = True
