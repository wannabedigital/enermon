from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.db.models import Scenario
from app.db.schemas import ScenarioCreate, ScenarioRead

router = APIRouter(
    prefix="/scenarios",
    tags=["Scenarios"]
)


@router.get("/", response_model=List[ScenarioRead])
def get_scenarios(db: Session = Depends(get_db)):
    return db.query(Scenario).all()


@router.post("/", response_model=ScenarioRead)
def create_scenario(
    scenario: ScenarioCreate,
    db: Session = Depends(get_db)
):
    db_scenario = Scenario(**scenario.dict())
    db.add(db_scenario)
    db.commit()
    db.refresh(db_scenario)
    return db_scenario
