import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Header from './Header';
import { Clock, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard/stats`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);


  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-100min-h-screen bg-gray-100">
      <Header />
      {!stats? <div className={`flex h-[40vh] justify-center items-center ${stats === null ? '' : 'fade-out'}`}><div className='animate-spin'><Loader2 size={50}/></div></div>:
      <main className={`max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 fade-in`}>
        <div className="px-4 py-6 sm:px-0">
          {/* <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1> */}
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">Summary</h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Tasks</dt>
                      <dd className="text-3xl font-semibold text-gray-900">{stats.totalTasks}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Completed Tasks</dt>
                      <dd className="text-3xl font-semibold text-gray-900">{stats.percentCompleted.toFixed(1)}%</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <XCircle className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Pending Tasks</dt>
                      <dd className="text-3xl font-semibold text-gray-900">{stats.percentPending.toFixed(1)}%</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Avg. Completion Time</dt>
                      <dd className="text-3xl font-semibold text-gray-900">{stats.averageCompletionTime.toFixed(1)}h</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-3">Pending Task Summary</h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <XCircle className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Pending Tasks</dt>
                      <dd className="text-3xl font-semibold text-gray-900">{stats.pendingTasks}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Time to finish </dt>
                      <dd className="text-3xl font-semibold text-gray-900">{stats.totalTimeToFinish}h</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Time Elapsed</dt>
                      <dd className="text-3xl font-semibold text-gray-900">{stats.totalPendingTimeLapsed}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Task Completion Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.taskCompletionChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Time Analysis by Priority</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Tasks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Lapsed (h)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance Estimate (h)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(stats.timeLapsedByPriority).map(([priority, timeLapsed]) => (
                    <tr key={priority}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Priority {priority}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.countPendingByPriority[priority]}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{timeLapsed.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.balanceEstimateByPriority[priority].toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      }
    </div>
  );
};

export default Dashboard;

