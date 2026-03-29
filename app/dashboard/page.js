'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('user');


  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState({ title: '', description: '', status: 'pending' });
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();

  useEffect(() => {

    const role = localStorage.getItem('userRole');
    if (!role) {
      router.push('/login');
    } else {
      setUserRole(role);
      fetchTasks();
    }
  }, [router]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/tasks');
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('userRole');
          router.push('/login');
        }
        throw new Error(data.error || 'Failed to fetch tasks');
      }

      setTasks(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const url = isEditing ? `/api/v1/tasks/${currentTask._id}` : '/api/v1/tasks';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentTask)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to save task');

      setShowModal(false);
      triggerSuccessMessage(`Task successfully ${isEditing ? 'updated' : 'created'}`);
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const res = await fetch(`/api/v1/tasks/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete task');
      }

      setTasks(tasks.filter(t => t._id !== id));
      triggerSuccessMessage('Task successfully deleted');
    } catch (err) {
      setError(err.message);
    }
  };

  const openModal = (task = null) => {
    if (task) {
      setCurrentTask({ ...task });
      setIsEditing(true);
    } else {
      setCurrentTask({ title: '', description: '', status: 'pending' });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const triggerSuccessMessage = (msg) => {

    setError(null);
    const prevMsg = error;
    setError({ type: 'success', text: msg });
    setTimeout(() => {
      setError(prevMsg);
    }, 3000);
  };

  if (loading && tasks.length === 0) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center mt-4">
          <div className="badge badge-pending">Loading tasks...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '2rem 0', flexGrow: 1 }}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2>Task Dashboard</h2>
            <p className="text-muted text-sm">
              Role: <span className={userRole === 'admin' ? 'badge badge-admin' : 'badge'}>{userRole}</span>
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => openModal()}>
            + New Task
          </button>
        </div>

        {error && (
          <div className={error.type === 'success' ? 'alert alert-success mt-2 mb-2' : 'alert alert-error mt-2 mb-2'}>
            {error.text || error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {tasks.length === 0 && !loading ? (
            <div className="glass-panel text-center" style={{ padding: '3rem', gridColumn: '1 / -1' }}>
              <p className="text-muted text-lg mb-2">No tasks found</p>
              <button className="btn btn-primary" onClick={() => openModal()}>Create your first task</button>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className="glass-panel animate-fade-in flex flex-col justify-between" style={{ padding: '1.5rem', height: '100%' }}>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', margin: 0 }}>
                      {task.title}
                    </h3>
                    <span className={task.status === 'completed' ? 'badge badge-completed' : 'badge badge-pending'}>
                      {task.status}
                    </span>
                  </div>

                  {userRole === 'admin' && task.userId && (
                    <div style={{ fontSize: '0.8rem', color: '#a78bfa', marginBottom: '0.8rem' }}>
                      👤 Owner: {task.userId.name || 'Unknown'} ({task.userId.email})
                    </div>
                  )}

                  <p className="text-muted" style={{ fontSize: '0.95rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1.5rem' }}>
                    {task.description}
                  </p>
                </div>

                <div className="flex gap-2" style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  <button className="btn btn-secondary flex-1" style={{ padding: '0.5rem' }} onClick={() => openModal(task)}>
                    Edit
                  </button>
                  <button className="btn flex-1" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.5rem' }} onClick={() => handleDelete(task._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>


      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: '1rem'
        }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem', background: 'var(--bg-color)', border: '1px solid var(--primary)' }}>
            <h3 className="mb-4">{isEditing ? 'Edit Task' : 'Create New Task'}</h3>
            <form onSubmit={handleSaveTask}>
              <div className="input-group">
                <label className="input-label" htmlFor="title">Task Title</label>
                <input
                  id="title"
                  type="text"
                  className="input-field"
                  placeholder="Task title..."
                  value={currentTask.title}
                  onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="desc">Description</label>
                <textarea
                  id="desc"
                  className="input-field"
                  placeholder="Task description..."
                  rows={4}
                  value={currentTask.description}
                  onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="status">Status</label>
                <select
                  id="status"
                  className="input-field"
                  value={currentTask.status}
                  onChange={(e) => setCurrentTask({ ...currentTask, status: e.target.value })}
                  style={{ appearance: 'auto' }}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex gap-2 mt-4 justify-between">
                <button type="button" className="btn btn-secondary w-full" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary w-full">
                  {isEditing ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
