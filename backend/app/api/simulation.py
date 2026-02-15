from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.schemas import SimulationCreate, SimulationRead
from app.services.simulation_service import run_and_save_simulation

router = APIRouter(
    prefix="/simulation",
    tags=["Simulation"]
)


@router.post("/run", response_model=SimulationRead)
def run_simulation_api(
    data: SimulationCreate,
    db: Session = Depends(get_db)
):
    try:
        return run_and_save_simulation(
            db=db,
            scenario_id=data.scenario_id,
            duration=data.duration,
            time_step=data.time_step
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
