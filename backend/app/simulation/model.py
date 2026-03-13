# enermon/backend/app/simulation/model.py
import simpy
import random
from enum import Enum
from decimal import Decimal, ROUND_HALF_UP
from typing import Optional
from datetime import datetime


class ConsumerState(Enum):
    """Состояния энергопотребителя"""
    OFF = "off"
    STANDBY = "standby"
    ACTIVE = "active"
    PEAK = "peak"


def consumer_process(
    env: simpy.Environment,
    consumer,
    scenario,
    time_step: int,
    results: list,
    work_start_hour: int = 8,
    work_end_hour: int = 22,
    simulated_start_time: Optional[datetime] = None
):
    """
    Имитационная модель поведения одного электропотребителя.
    Возвращает энергию в Вт·ч за каждый шаг симуляции.

    nominal_power в БД хранится в кВт, поэтому умножаем на 1000.
    """
    state = ConsumerState.OFF


    activity_shift = random.randint(-1, 1)
    peak_probability = random.uniform(0.05, 0.15)
    noise_factor = random.uniform(0.9, 1.1)


    power_map = {
        ConsumerState.OFF: Decimal("0.0"),
        ConsumerState.STANDBY: Decimal("0.2"),
        ConsumerState.ACTIVE: Decimal("1.0"),
        ConsumerState.PEAK: Decimal("1.5"),
    }


    KW_TO_W = Decimal("1000")
    WATT_SECONDS_TO_WATT_HOURS = Decimal("3600")


    start_offset_seconds = 0
    if simulated_start_time:
        start_offset_seconds = (
            simulated_start_time.hour * 3600 +
            simulated_start_time.minute * 60 +
            simulated_start_time.second
        )

    while True:

        total_seconds = start_offset_seconds + env.now
        hour = int((total_seconds // 3600) % 24)


        building_active = work_start_hour <= hour <= work_end_hour


        if not building_active:
            state = ConsumerState.OFF
        elif state == ConsumerState.OFF:
            state = ConsumerState.STANDBY
        elif state == ConsumerState.STANDBY:
            if work_start_hour + activity_shift <= hour <= work_end_hour + activity_shift:
                state = ConsumerState.ACTIVE
        elif state == ConsumerState.ACTIVE:
            if random.random() < peak_probability:
                state = ConsumerState.PEAK
            elif hour >= work_end_hour:
                state = ConsumerState.STANDBY
        elif state == ConsumerState.PEAK:
            if random.random() < 0.3:
                state = ConsumerState.ACTIVE


        energy_watt_seconds = (
            Decimal(consumer.nominal_power)
            * KW_TO_W
            * power_map[state]
            * Decimal(time_step)
            * Decimal(scenario.consumption_factor)
            * Decimal(str(noise_factor))
        )


        energy_watt_hours = (energy_watt_seconds / WATT_SECONDS_TO_WATT_HOURS).quantize(
            Decimal("0.0001"), rounding=ROUND_HALF_UP
        )


        results.append({
            "time": int(env.now),
            "consumer_id": consumer.id,
            "state": state.value,
            "energy": float(energy_watt_hours)
        })


        yield env.timeout(time_step)
