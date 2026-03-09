# enermon/backend/app/simulation/engine.py
import simpy
from decimal import Decimal
from typing import List
from app.simulation.model import consumer_process


def run_simulation(
    consumers: List,
    scenario,
    duration: int,
    time_step: int,
    work_start_hour: int = 8,
    work_end_hour: int = 22
):
    """
    Запуск дискретно-событийной симуляции.
    """
    env = simpy.Environment()
    results = []

    for consumer in consumers:
        env.process(
            consumer_process(
                env,
                consumer,
                scenario,
                time_step,
                results,
                work_start_hour,
                work_end_hour
            )
        )

    env.run(until=duration)
    return results
