import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, Trash2, CheckSquare } from 'lucide-react';
import Header from './Header';
import ConfirmationModal from './ConfirmationModal.jsx';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({ priority: '', status: '' });
  const [sortBy, setSortBy] = useState('startTime');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null); 
  const { logout } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, [filter, sortBy]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tasks/filter`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params: { ...filter, sortBy }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
    setShowDeleteModal(false);
  };

  const handleBulkDelete = async () => {
    try {
      const deletePromises = Array.from(selectedTasks).map(id =>
        axios.delete(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      );
      await Promise.all(deletePromises);
      setSelectedTasks(new Set());
      fetchTasks();
    } catch (error) {
      console.error('Error deleting tasks:', error);
    }
  };

  const toggleTaskSelection = (id) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTasks(newSelected);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      1: 'bg-red-100 text-red-800',
      2: 'bg-orange-100 text-orange-800',
      3: 'bg-yellow-100 text-yellow-800',
      4: 'bg-blue-100 text-blue-800',
      5: 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Header/>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Your Tasks</h2>
            <div className="flex space-x-4">
              {selectedTasks.size > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected ({selectedTasks.size})
                </button>
              )}
              <Link
                to="/add-task"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="finished">Finished</option>
              </select>

              <select
                value={filter.priority}
                onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg"
              >
                <option value="">All Priorities</option>
                <option value="1">Priority 1 (Highest)</option>
                <option value="2">Priority 2</option>
                <option value="3">Priority 3</option>
                <option value="4">Priority 4</option>
                <option value="5">Priority 5 (Lowest)</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg"
              >
                <option value="startTime">Sort by Start Time</option>
                <option value="endTime">Sort by End Time</option>
                <option value="priority">Sort by Priority</option>
              </select>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
          </div>

          <div className=" fade-in grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks
              .filter(task => 
                task.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((task) => (
                <div
                  key={task._id}
                  className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 ${
                    selectedTasks.has(task._id) ? 'ring-2 ring-indigo-500' : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedTasks.has(task._id)}
                          onChange={() => toggleTaskSelection(task._id)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-500">#{task._id}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        Priority {task.priority}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">
                        Start: {new Date(task.startTime).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        End: {new Date(task.endTime).toLocaleString()}
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.status === 'finished' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
                    <Link
                      to={`/edit-task/${task._id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => {setShowDeleteModal(true); setTaskToDelete(task._id)}}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                    <ConfirmationModal
                      isOpen={showDeleteModal}
                      onClose={() => setShowDeleteModal(false)}
                      onConfirm={()=>handleDelete(taskToDelete)}
                      title="Delete Task"
                      message="Are you sure you want to delete this task?"
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TaskList;

