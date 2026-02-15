from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from decimal import Decimal

from app.db.models import (
    Simulation,
    SimulationResult,
    Consumer,
    Scenario
)
from app.simulation.engine import run_simulation


def run_and_save_simulation(
    db: Session,
    scenario_id: int,
    duration: int,
    time_step: int
):
    scenario = db.query(Scenario).get(scenario_id)
    if not scenario:
        raise ValueError("Scenario not found")

    consumers = db.query(Consumer).all()

    simulation = Simulation(
        scenario_id=scenario_id,
        start_time=datetime.utcnow(),
        duration=duration,
        time_step=time_step
    )

    db.add(simulation)
    db.commit()
    db.refresh(simulation)

    raw_results = run_simulation(
        consumers=consumers,
        scenario_factor=scenario.consumption_factor,
        duration=duration,
        time_step=time_step
    )

    for r in raw_results:
        db_result = SimulationResult(
            simulation_id=simulation.id,
            timestamp=simulation.start_time + timedelta(seconds=r["time"]),
            energy_value=r["energy"]
        )
        db.add(db_result)

    db.commit()
    return simulation
