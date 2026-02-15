from sqlalchemy import Column, Integer, String, Numeric, TIMESTAMP, text, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.session import Base


class Building(Base):
    __tablename__ = "buildings"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    address = Column(String(255))
    area = Column(Numeric(10, 2))
    created_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )


class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    building_id = Column(Integer, ForeignKey("buildings.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    area = Column(Numeric(10, 2))
    room_type = Column(String(50))
    created_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )

    building = relationship("Building", backref="rooms")


class Consumer(Base):
    __tablename__ = "consumers"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    consumer_type = Column(String(50))
    nominal_power = Column(Numeric(10, 3), nullable=False)
    created_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )

    room = relationship("Room", backref="consumers")


class Scenario(Base):
    __tablename__ = "scenarios"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    consumption_factor = Column(Numeric(5, 3), default=1.0)
    created_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )


class Simulation(Base):
    __tablename__ = "simulations"

    id = Column(Integer, primary_key=True, index=True)
    scenario_id = Column(Integer, ForeignKey("scenarios.id"), nullable=False)
    start_time = Column(TIMESTAMP, nullable=False)
    duration = Column(Integer, nullable=False)
    time_step = Column(Integer, nullable=False)
    created_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )

    scenario = relationship("Scenario")
    results = relationship(
        "SimulationResult",
        back_populates="simulation",
        cascade="all, delete"
    )


class SimulationResult(Base):
    __tablename__ = "simulation_results"

    id = Column(Integer, primary_key=True, index=True)
    simulation_id = Column(Integer, ForeignKey("simulations.id"), nullable=False)
    timestamp = Column(TIMESTAMP, nullable=False)
    energy_value = Column(Numeric(12, 4), nullable=False)

    simulation = relationship("Simulation", back_populates="results")
