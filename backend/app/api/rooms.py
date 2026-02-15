from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.db.models import Room
from app.db.schemas import RoomRead, RoomCreate

router = APIRouter(
    prefix="/rooms",
    tags=["Rooms"]
)


@router.get("/", response_model=List[RoomRead])
def get_rooms(
    building_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Room)
    if building_id is not None:
        query = query.filter(Room.building_id == building_id)
    return query.all()


@router.post("/", response_model=RoomRead)
def create_room(
    room: RoomCreate,
    db: Session = Depends(get_db)
):
    db_room = Room(**room.dict())
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room
