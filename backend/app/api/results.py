from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.db.models import SimulationResult
from app.db.schemas import SimulationResultRead

router = APIRouter(
    prefix="/results",
    tags=["Results"]
)


@router.get(
    "/{simulation_id}",
    response_model=List[SimulationResultRead]
)
def get_simulation_results(
    simulation_id: int,
    db: Session = Depends(get_db)
):
    results = (
        db.query(SimulationResult)
        .filter(SimulationResult.simulation_id == simulation_id)
        .order_by(SimulationResult.timestamp)
        .all()
    )

    if not results:
        raise HTTPException(
            status_code=404,
            detail="Results not found"
        )

    return results
