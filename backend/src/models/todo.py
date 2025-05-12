from bson import ObjectId
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, field):  # Añadimos el argumento 'field'
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return cls(v)  # Devolvemos una instancia de PyObjectId

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")

class TodoBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    completed: bool = Field(default=False)
    priority: str = Field(default="medium", pattern="^(low|medium|high)$")
    dueDate: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    completed: Optional[bool] = None
    priority: Optional[str] = Field(None, pattern="^(low|medium|high)$")
    dueDate: Optional[datetime] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TodoInDB(TodoBase):
    id: PyObjectId = Field(alias="_id")

    class Config:
        json_encoders = {ObjectId: str, datetime: lambda dt: dt.isoformat()}
        populate_by_name = True