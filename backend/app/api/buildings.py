from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.db.models import Building
from app.db.schemas import BuildingRead, BuildingCreate

router = APIRouter(
    prefix="/buildings",
    tags=["Buildings"]
)


@router.get("/", response_model=List[BuildingRead])
def get_buildings(db: Session = Depends(get_db)):
    return db.query(Building).all()

@router.post("/", response_model=BuildingRead)
def create_building(
    building: BuildingCreate,
    db: Session = Depends(get_db)
):
    db_building = Building(**building.dict())
    db.add(db_building)
    db.commit()
    db.refresh(db_building)
    return db_building
