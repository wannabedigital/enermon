import simpy
from decimal import Decimal
from typing import List

from app.simulation.model import consumer_process

def run_simulation(
    consumers: List,
    scenario_factor: Decimal,
    duration: int,
    time_step: int
):
    env = simpy.Environment()
    results = []

    for consumer in consumers:
        env.process(
            consumer_process(
                env,
                consumer,
                scenario_factor,
                time_step,
                results
            )
        )

    env.run(until=duration)
    return results
