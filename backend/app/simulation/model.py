import simpy
import random
from enum import Enum
from decimal import Decimal


class ConsumerState(Enum):
    OFF = "off"
    STANDBY = "standby"
    ACTIVE = "active"
    PEAK = "peak"


def consumer_process(
    env: simpy.Environment,
    consumer,
    scenario,
    time_step: int,
    results: list
):
    """
    Имитационная модель поведения одного электропотребителя
    """

    state = ConsumerState.OFF

    # индивидуальные параметры потребителя
    activity_shift = random.randint(-1, 1)          # сдвиг рабочего времени
    peak_probability = random.uniform(0.05, 0.15)   # вероятность пика
    noise_factor = random.uniform(0.9, 1.1)         # случайные колебания

    while True:
        hour = int((env.now // 3600) % 24)

        building_active = 8 <= hour <= 22

        # --- ЛОГИКА СОСТОЯНИЙ ---
        if not building_active:
            state = ConsumerState.OFF

        elif state == ConsumerState.OFF:
            state = ConsumerState.STANDBY

        elif state == ConsumerState.STANDBY:
            if 9 + activity_shift <= hour <= 18 + activity_shift:
                state = ConsumerState.ACTIVE

        elif state == ConsumerState.ACTIVE:
            # случайный пик нагрузки
            if random.random() < peak_probability:
                state = ConsumerState.PEAK
            elif hour >= 18:
                state = ConsumerState.STANDBY

        elif state == ConsumerState.PEAK:
            # пик длится ограниченное время
            if random.random() < 0.3:
                state = ConsumerState.ACTIVE

        # --- КОЭФФИЦИЕНТ МОЩНОСТИ ---
        power_map = {
            ConsumerState.OFF: Decimal("0.0"),
            ConsumerState.STANDBY: Decimal("0.2"),
            ConsumerState.ACTIVE: Decimal("1.0"),
            ConsumerState.PEAK: Decimal("1.5"),
        }

        # --- РАСЧЁТ ЭНЕРГИИ ---
        energy = (
            Decimal(consumer.nominal_power)
            * power_map[state]
            * Decimal(time_step)
            * Decimal(scenario.consumption_factor)
            * Decimal(str(noise_factor))
        )

        results.append({
            "time": int(env.now),
            "consumer_id": consumer.id,
            "state": state.value,
            "energy": float(energy)
        })

        yield env.timeout(time_step)
