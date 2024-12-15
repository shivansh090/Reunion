import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Save } from 'lucide-react';
import Header from './Header';

const AddEditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const getLocalISOTime = () => 
    new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  
  const [task, setTask] = useState({
    title: '',
    startTime: getLocalISOTime(), // Adjusted to local time
    endTime: getLocalISOTime(), // Adjusted to local time
    priority: '3',
    status: 'pending',
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      fetchTask();
    }
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const taskData = response.data;
      console.log(new Date(taskData.startTime).toLocaleString());
      console.log(new Date(taskData.startTime).toISOString());
      setTask({
        ...taskData,
        startTime: new Date(new Date(taskData.startTime).getTime() - new Date(taskData.startTime).getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16),
        endTime: new Date(new Date(taskData.startTime).getTime() - new Date(taskData.startTime).getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)
      });
    } catch (error) {
      console.error('Error fetching task:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!task.title.trim()) newErrors.title = 'Title is required';
    if (!task.startTime) newErrors.startTime = 'Start time is required';
    if (!task.endTime) newErrors.endTime = 'End time is required';
    if (new Date(task.endTime) < new Date(task.startTime)) {
      newErrors.endTime = 'End time must be after start time';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (id) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`, task, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/tasks`, task, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      navigate('/tasks');
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Header/>

      <main className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/tasks')}
                className="mr-4 text-white hover:text-indigo-100 transition-colors duration-200"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-white">{id ? 'Edit Task' : 'Add New Task'}</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={task.title}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                } px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="Enter task title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="datetime-local"
                  id="startTime"
                  name="startTime"
                  value={task.startTime}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-lg border ${
                    errors.startTime ? 'border-red-300' : 'border-gray-300'
                  } px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.startTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
                )}
              </div>

              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                  type="datetime-local"
                  id="endTime"
                  name="endTime"
                  value={task.endTime}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-lg border ${
                    errors.endTime ? 'border-red-300' : 'border-gray-300'
                  } px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.endTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
              <select
                id="priority"
                name="priority"
                value={task.priority}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="1">Priority 1 (Highest)</option>
                <option value="2">Priority 2</option>
                <option value="3">Priority 3</option>
                <option value="4">Priority 4</option>
                <option value="5">Priority 5 (Lowest)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="pending"
                    checked={task.status === 'pending'}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-indigo-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Pending</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="finished"
                    checked={task.status === 'finished'}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-indigo-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Finished</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Save className="w-5 h-5 mr-2" />
              {id ? 'Update Task' : 'Add Task'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddEditTask;

