from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Database
from .routers import todos

app = FastAPI(
    title="Todo List API",
    description="A simple Todo List API built with FastAPI and MongoDB",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(todos.router)

@app.on_event("startup")
async def startup_db_client():
    await Database.connect_db()

@app.on_event("shutdown")
async def shutdown_db_client():
    await Database.close_db()

@app.get("/")
async def root():
    return {"message": "Welcome to the Todo List API"}
