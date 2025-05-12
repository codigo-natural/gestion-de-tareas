import { useState, useEffect } from 'react';
import { FaPlus, FaEdit } from 'react-icons/fa';

const TodoForm = ({ onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    completed: false,
    priority: 'medium',
    dueDate: '',
  });

  const [errors, setErrors] = useState({});

  // Actualizar el formulario cuando cambia initialData
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        completed: initialData.completed || false,
        priority: initialData.priority || 'medium',
        dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      // Resetear el formulario cuando no hay initialData
      setFormData({
        title: '',
        description: '',
        completed: false,
        priority: 'medium',
        dueDate: '',
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }
    if (formData.title.length > 100) {
      newErrors.title = 'El título no puede tener más de 100 caracteres';
    }
    if (formData.description.length > 500) {
      newErrors.description = 'La descripción no puede tener más de 500 caracteres';
    }
    if (formData.dueDate && new Date(formData.dueDate) < new Date()) {
      newErrors.dueDate = 'La fecha límite no puede ser en el pasado';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      if (!initialData) {
        setFormData({
          title: '',
          description: '',
          completed: false,
          priority: 'medium',
          dueDate: '',
        });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpiar error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md 
      transition-all duration-300 ease-in-out animate-fade-in">
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Título
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 
            transition-all duration-200 ease-in-out
            ${errors.title
              ? 'border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400'
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400'
            }
            bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400`}
          placeholder="Ingrese el título de la tarea"
        />
        {errors.title && (
          <p className="mt-2 text-sm text-red-500 dark:text-red-400 animate-shake">{errors.title}</p>
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 
            transition-all duration-200 ease-in-out
            ${errors.description
              ? 'border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400'
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400'
            }
            bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400`}
          placeholder="Ingrese la descripción de la tarea"
          rows="3"
        />
        {errors.description && (
          <p className="mt-2 text-sm text-red-500 dark:text-red-400 animate-shake">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Prioridad
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              transition-all duration-200 ease-in-out"
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Fecha Límite
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 
              transition-all duration-200 ease-in-out
              ${errors.dueDate
                ? 'border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400'
                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400'
              }
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
          />
          {errors.dueDate && (
            <p className="mt-2 text-sm text-red-500 dark:text-red-400 animate-shake">{errors.dueDate}</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="flex items-center space-x-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              name="completed"
              checked={formData.completed}
              onChange={handleChange}
              className="sr-only"
            />
            <div className={`w-6 h-6 border-2 rounded transition-all duration-200 ease-in-out
              ${formData.completed
                ? 'bg-blue-500 border-blue-500 dark:bg-blue-400 dark:border-blue-400'
                : 'border-gray-300 dark:border-gray-600 group-hover:border-blue-500 dark:group-hover:border-blue-400'
              }`}
            >
              {formData.completed && (
                <svg className="w-4 h-4 text-white transform scale-100 transition-transform duration-200"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-500 
            dark:group-hover:text-blue-400 transition-colors duration-200">
            Completada
          </span>
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 
          text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
          focus:ring-offset-2 dark:focus:ring-offset-gray-800
          flex items-center justify-center space-x-2 transition-all duration-200 ease-in-out
          transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
      >
        {initialData ? (
          <>
            <FaEdit className="w-4 h-4" />
            <span>Actualizar Tarea</span>
          </>
        ) : (
          <>
            <FaPlus className="w-4 h-4" />
            <span>Agregar Tarea</span>
          </>
        )}
      </button>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </form>
  );
};

export default TodoForm; 