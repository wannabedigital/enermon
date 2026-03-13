from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.db.models import Simulation
from app.db.schemas import SimulationRead
from app.db.models import SimulationSummary

router = APIRouter(
    prefix="/simulations",
    tags=["Simulations"]
)

@router.get("/", response_model=List[SimulationRead])
def get_all_simulations(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Получить список всех симуляций (для истории)"""
    simulations = (
        db.query(Simulation)
        .order_by(Simulation.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return simulations

@router.get("/{simulation_id}", response_model=SimulationRead)
def get_simulation(
    simulation_id: int,
    db: Session = Depends(get_db)
):
    """Получить детали одной симуляции"""
    simulation = db.query(Simulation).filter(Simulation.id == simulation_id).first()
    if not simulation:
        raise HTTPException(status_code=404, detail="Simulation not found")
    return simulation
