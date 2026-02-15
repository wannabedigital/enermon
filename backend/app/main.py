from fastapi import FastAPI





app = FastAPI(
    title="EnerMon",
    description="Автоматизированная система имитационного моделирования мониторинга энергопотребления в здании",
    version="1.0.0"
)


@app.get("/")
def root():
    return {"message": "EnerMon API is running"}


from app.db import models
from app.db.session import engine

models.Base.metadata.bind = engine


from app.api import buildings

app.include_router(buildings.router)


from app.api import rooms

app.include_router(rooms.router)


from app.api import consumers

app.include_router(consumers.router)


from app.api import scenarios

app.include_router(scenarios.router)


from app.api import simulation

app.include_router(simulation.router)


from app.api import results

app.include_router(results.router)


from app.api import summary

app.include_router(summary.router)
