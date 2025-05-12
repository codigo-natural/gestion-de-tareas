from fastapi import APIRouter, HTTPException, status
from typing import List
from bson import ObjectId
from datetime import datetime
from ..models.todo import TodoCreate, TodoUpdate, TodoInDB
from ..database import Database

router = APIRouter(prefix="/todos", tags=["todos"])

@router.get("/", response_model=List[TodoInDB])
async def get_todos():
    try:
        db = Database.get_db()
        todos = await db.todos.find().to_list(length=100)
        return todos
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener las tareas: {str(e)}"
        )

@router.get("/{todo_id}", response_model=TodoInDB)
async def get_todo(todo_id: str):
    if not ObjectId.is_valid(todo_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID de tarea inválido"
        )
    
    try:
        db = Database.get_db()
        todo = await db.todos.find_one({"_id": ObjectId(todo_id)})
        if todo is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tarea no encontrada"
            )
        return todo
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener la tarea: {str(e)}"
        )

@router.post("/", response_model=TodoInDB, status_code=status.HTTP_201_CREATED)
async def create_todo(todo: TodoCreate):
    try:
        # Validar fecha límite
        if todo.dueDate and todo.dueDate < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La fecha límite no puede ser en el pasado"
            )

        db = Database.get_db()
        todo_dict = todo.model_dump()
        result = await db.todos.insert_one(todo_dict)
        created_todo = await db.todos.find_one({"_id": result.inserted_id})
        return created_todo
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear la tarea: {str(e)}"
        )

@router.put("/{todo_id}", response_model=TodoInDB)
async def update_todo(todo_id: str, todo_update: TodoUpdate):
    if not ObjectId.is_valid(todo_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID de tarea inválido"
        )
    
    try:
        # Validar fecha límite si se proporciona
        if todo_update.dueDate and todo_update.dueDate < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La fecha límite no puede ser en el pasado"
            )

        db = Database.get_db()
        update_data = {k: v for k, v in todo_update.model_dump().items() if v is not None}
        
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No se proporcionaron datos válidos para actualizar"
            )
        
        result = await db.todos.update_one(
            {"_id": ObjectId(todo_id)},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tarea no encontrada"
            )
        
        updated_todo = await db.todos.find_one({"_id": ObjectId(todo_id)})
        return updated_todo
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar la tarea: {str(e)}"
        )

@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(todo_id: str):
    if not ObjectId.is_valid(todo_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID de tarea inválido"
        )
    
    try:
        db = Database.get_db()
        result = await db.todos.delete_one({"_id": ObjectId(todo_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tarea no encontrada"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar la tarea: {str(e)}"
        ) 