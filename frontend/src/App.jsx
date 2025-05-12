import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { todoService } from './services/todoService';

function App() {
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'pending'
  const [sortBy, setSortBy] = useState('createdAt'); // 'createdAt', 'title', 'priority'

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const data = await todoService.getAllTodos();
      setTodos(data);
    } catch (error) {
      toast.error('Error al cargar las tareas');
      console.error('Error loading todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (todoData) => {
    try {
      if (editingTodo) {
        await todoService.updateTodo(editingTodo._id, todoData);
        toast.success('Tarea actualizada exitosamente');
        setEditingTodo(null);
      } else {
        await todoService.createTodo(todoData);
        toast.success('Tarea creada exitosamente');
      }
      loadTodos();
    } catch (error) {
      toast.error(editingTodo ? 'Error al actualizar la tarea' : 'Error al crear la tarea');
      console.error('Error saving todo:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      try {
        await todoService.deleteTodo(id);
        toast.success('Tarea eliminada exitosamente');
        loadTodos();
      } catch (error) {
        toast.error('Error al eliminar la tarea');
        console.error('Error deleting todo:', error);
      }
    }
  };

  const handleToggleComplete = async (todo) => {
    try {
      await todoService.updateTodo(todo._id, { completed: !todo.completed });
      toast.success(`Tarea marcada como ${!todo.completed ? 'completada' : 'pendiente'}`);
      loadTodos();
    } catch (error) {
      toast.error('Error al actualizar el estado de la tarea');
      console.error('Error toggling todo:', error);
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    const formElement = document.querySelector('form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  const filteredAndSortedTodos = todos
    .filter(todo => {
      if (filter === 'completed') return todo.completed;
      if (filter === 'pending') return !todo.completed;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'createdAt') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'priority') return (b.priority || 0) - (a.priority || 0);
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Lista de Tareas
        </h1>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            {editingTodo && (
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Editando tarea</h2>
                <button
                  onClick={handleCancelEdit}
                  className="text-sm text-sky-600 hover:cursor-pointer hover:text-sky-800"
                >
                  Cancelar edición
                </button>
              </div>
            )}
            <TodoForm onSubmit={handleSubmit} initialData={editingTodo} />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por:</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full h-8 border border-blue-400 rounded-md shadow-sm focus:border-primary focus:ring-primary"
                >
                  <option value="all">Todas</option>
                  <option value="completed">Completadas</option>
                  <option value="pending">Pendientes</option>
                </select>
              </div>
              {/*<div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                >
                  <option value="createdAt">Fecha de creación</option>
                  <option value="title">Título</option>
                  <option value="priority">Prioridad</option>
                </select>
              </div>
              */}
            </div>

            <TodoList
              todos={filteredAndSortedTodos}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleComplete={handleToggleComplete}
            />
          </div>
        </div>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;