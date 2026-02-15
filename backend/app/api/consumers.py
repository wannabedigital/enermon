from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.db.models import Consumer
from app.db.schemas import ConsumerRead, ConsumerCreate

router = APIRouter(
    prefix="/consumers",
    tags=["Consumers"]
)


@router.get("/", response_model=List[ConsumerRead])
def get_consumers(
    room_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Consumer)
    if room_id is not None:
        query = query.filter(Consumer.room_id == room_id)
    return query.all()


@router.post("/", response_model=ConsumerRead)
def create_consumer(
    consumer: ConsumerCreate,
    db: Session = Depends(get_db)
):
    db_consumer = Consumer(**consumer.dict())
    db.add(db_consumer)
    db.commit()
    db.refresh(db_consumer)
    return db_consumer
