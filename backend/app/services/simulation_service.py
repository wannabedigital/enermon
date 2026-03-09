from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from decimal import Decimal

from app.db.models import (
    Simulation,
    SimulationResult,
    Consumer,
    Scenario,
    Room,
    Building
)

from app.simulation.engine import run_simulation


def run_and_save_simulation(
    db: Session,
    scenario_id: int,
    building_id: int,
    duration: int,
    time_step: int
):
    """
    Запуск симуляции для выбранного здания по указанному сценарию.
    Результаты сохраняются в базу данных.
    """

    scenario = db.query(Scenario).get(scenario_id)
    if not scenario:
        raise ValueError("Scenario not found")

    building = db.query(Building).get(building_id)
    if not building:
        raise ValueError("Building not found")

    consumers = (
        db.query(Consumer)
        .join(Room)
        .filter(Room.building_id == building_id)
        .all()
    )

    if not consumers:
        raise ValueError("No consumers found for this building")

    simulation = Simulation(
        scenario_id=scenario_id,
        building_id=building_id,
        start_time=datetime.utcnow(),
        duration=duration,
        time_step=time_step
    )

    db.add(simulation)
    db.commit()
    db.refresh(simulation)

    raw_results = run_simulation(
        consumers=consumers,
        scenario=scenario,
        duration=duration,
        time_step=time_step,
        work_start_hour=building.work_start_hour,
        work_end_hour=building.work_end_hour
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
