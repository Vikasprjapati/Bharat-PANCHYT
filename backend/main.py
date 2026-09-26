import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
from services.seed_data import seed_database
from routers import problems, validations, research, funding, projects, outcomes, stats

# Create Database tables
Base.metadata.create_all(bind=engine)

# Auto-seed database if empty
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

app = FastAPI(
    title="BHARAT-PANCHYT API",
    description="PEOPLES ACTUALL NEEDS CONNECTED WITH HIGHER EDUCATION YOUTH AND TECHNOLOGY",
    version="1.0.0"
)

# Enable CORS for frontend Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(problems.router)
app.include_router(validations.router)
app.include_router(research.router)
app.include_router(funding.router)
app.include_router(projects.router)
app.include_router(outcomes.router)
app.include_router(stats.router)

@app.get("/")
def root():
    return {
        "project": "BHARAT-PANCHYT",
        "full_form": "PEOPLES ACTUALL NEEDS CONNECTED WITH HIGHER EDUCATION YOUTH AND TECHNOLOGY",
        "tagline": "Connecting People's Real Problems With Research, Funding & Implementation.",
        "journey": "People → AI → Research → Funding → Impact",
        "ai_mode": "live" if os.environ.get("GEMINI_API_KEY") else "demo",
        "status": "online"
    }

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "platform": "BHARAT-PANCHYT",
        "ai_mode": "live" if os.environ.get("GEMINI_API_KEY") else "demo",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
