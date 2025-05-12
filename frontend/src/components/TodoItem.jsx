import { FaEdit, FaTrash, FaCalendarAlt, FaExclamationCircle } from 'react-icons/fa';

const TodoItem = ({ todo, onEdit, onDelete, onToggleComplete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return 'Sin prioridad';
    }
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

  return (
    <div
      className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md 
        transition-all duration-300 ease-in-out
        ${todo.completed ? 'border-l-4 border-green-500 dark:border-green-400 opacity-75' : ''}
        ${isOverdue ? 'border-r-4 border-red-500 dark:border-red-400' : ''}
        hover:shadow-lg hover:scale-[1.02] transform
        animate-fade-in`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={`text-lg font-semibold ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
              {todo.title}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(todo.priority)}`}>
              {getPriorityLabel(todo.priority)}
            </span>
          </div>

          {todo.description && (
            <p className={`mt-1 text-sm ${todo.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>
              {todo.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${todo.completed
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
              }`}>
              {todo.completed ? 'Completada' : 'Pendiente'}
            </span>

            {todo.dueDate && (
              <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${isOverdue
                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                }`}>
                <FaCalendarAlt className="text-xs" />
                {new Date(todo.dueDate).toLocaleDateString()}
                {isOverdue && <FaExclamationCircle className="text-xs ml-1 animate-pulse" />}
              </span>
            )}

            <span className="text-xs text-gray-500 dark:text-gray-400">
              Creada: {new Date(todo.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:ml-4">
          <button
            onClick={() => onToggleComplete(todo)}
            className={`p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 ${todo.completed
              ? 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400'
              }`}
            title={todo.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => { }}
              className="sr-only"
            />
            <span className={`block w-4 h-4 border-2 border-current rounded-sm cursor-pointer transition-all duration-200 ${todo.completed ? 'bg-current' : ''}`} />
          </button>

          <button
            onClick={() => onEdit(todo)}
            className="p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30 
              rounded-full transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            title="Editar tarea"
          >
            <FaEdit />
          </button>

          <button
            onClick={() => onDelete(todo._id)}
            className="p-2 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 
              rounded-full transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            title="Eliminar tarea"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem; 