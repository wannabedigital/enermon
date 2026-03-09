import simpy
import random
from enum import Enum
from decimal import Decimal, ROUND_HALF_UP


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
    work_end_hour: int = 22
):
    """
    Имитационная модель поведения одного электропотребителя.
    Возвращает энергию в Вт·ч за каждый шаг.

    ВАЖНО: nominal_power в БД хранится в кВт, поэтому умножаем на 1000.
    """
    state = ConsumerState.OFF

    activity_shift = random.randint(-1, 1)
    peak_probability = random.uniform(0.05, 0.15)
    noise_factor = random.uniform(0.9, 1.1)

    # Карта коэффициентов мощности для каждого состояния
    power_map = {
        ConsumerState.OFF: Decimal("0.0"),
        ConsumerState.STANDBY: Decimal("0.2"),
        ConsumerState.ACTIVE: Decimal("1.0"),
        ConsumerState.PEAK: Decimal("1.5"),
    }

    # Константы для конвертации:
    # 1 кВт = 1000 Вт
    # 1 Вт·ч = 3600 Вт·с
    KW_TO_W = Decimal("1000")
    WATT_SECONDS_TO_WATT_HOURS = Decimal("3600")

    while True:
        hour = int((env.now // 3600) % 24)
        building_active = work_start_hour <= hour <= work_end_hour

        # Логика перехода между состояниями
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

        # ← Расчёт энергии: кВт → Вт → Вт·с → Вт·ч
        energy_watt_seconds = (
            Decimal(consumer.nominal_power)  # кВт из БД
            * KW_TO_W                         # ← конвертируем в Вт
            * power_map[state]                # коэффициент состояния
            * Decimal(time_step)              # секунды
            * Decimal(scenario.consumption_factor)
            * Decimal(str(noise_factor))
        )

        # Конвертируем Вт·с → Вт·ч с округлением
        energy_watt_hours = (energy_watt_seconds / WATT_SECONDS_TO_WATT_HOURS).quantize(
            Decimal("0.0001"), rounding=ROUND_HALF_UP
        )

        # ← Ключи БЕЗ пробелов!
        results.append({
            "time": int(env.now),
            "consumer_id": consumer.id,
            "state": state.value,
            "energy": float(energy_watt_hours)  # Уже в Вт·ч
        })

        yield env.timeout(time_step)
