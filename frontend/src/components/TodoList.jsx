import { useState } from 'react';
import { FaSearch, FaSort } from 'react-icons/fa';
import TodoItem from './TodoItem';

const TodoList = ({ todos, onEdit, onDelete, onToggleComplete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  const priorityOrder = { high: 3, medium: 2, low: 1 };

  const filteredAndSortedTodos = todos
    .filter(todo => {
      const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'priority':
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative group">
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 
              rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
              transition-all duration-200 ease-in-out
              placeholder-gray-500 dark:placeholder-gray-400"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 
            group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400
            transition-colors duration-200" />
        </div>

        <div className="relative group gap-4 flex justify-between">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 
              rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
              appearance-none cursor-pointer
              transition-all duration-200 ease-in-out"
          >
            <option value="createdAt">Fecha de creación</option>
            <option value="title">Título</option>
            <option value="priority">Prioridad</option>
            <option value="dueDate">Fecha límite</option>
          </select>
          <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 
            group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400
            pointer-events-none transition-colors duration-200" />
        </div>
      </div>

      <div className="space-y-4">
        {filteredAndSortedTodos.length === 0 ? (
          <div className="text-center py-12 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg
            animate-fade-in">
            No hay tareas que coincidan con los criterios de búsqueda
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAndSortedTodos.map((todo, index) => (
              <div
                key={todo._id}
                className="transform transition-all duration-300 ease-in-out"
                style={{
                  animation: `fadeIn 0.3s ease-out ${index * 0.1}s both`
                }}
              >
                <TodoItem
                  todo={todo}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleComplete={onToggleComplete}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList; 