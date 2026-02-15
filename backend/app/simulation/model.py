import simpy
from decimal import Decimal


def consumer_process(
    env: simpy.Environment,
    consumer,
    scenario_factor: Decimal,
    time_step: int,
    results: list
):
    while True:
        energy = (
            Decimal(consumer.nominal_power)
            * Decimal(time_step)
            * Decimal(scenario_factor)
        )

        results.append({
            "time": env.now,
            "consumer_id": consumer.id,
            "energy": energy
        })

        yield env.timeout(time_step)
