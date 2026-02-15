from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models import SimulationSummary
from app.db.schemas import SimulationSummaryRead

router = APIRouter(
    prefix="/summary",
    tags=["Summary"]
)


@router.get(
    "/{simulation_id}",
    response_model=SimulationSummaryRead
)
def get_summary(
    simulation_id: int,
    db: Session = Depends(get_db)
):
    summary = (
        db.query(SimulationSummary)
        .filter(SimulationSummary.simulation_id == simulation_id)
        .first()
    )

    if not summary:
        raise HTTPException(
            status_code=404,
            detail="Summary not found"
        )

    return summary
