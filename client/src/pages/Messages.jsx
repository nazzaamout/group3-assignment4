// Messages.jsx
import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import '../styles/Layout.css';

function Messages() {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  const fetchMessages = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/messages', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error('Failed to load messages');
      const data = await res.json();
      setMessages(data);
      setError('');
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const res = await fetch('http://localhost:3001/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error('Failed to post message');
      setContent('');
      setError('');
      fetchMessages();
    } catch (err) {
      console.error('POST error:', err);
      setError(err.message);
    }
  };

  const handleDelete = async id => {
    if (!confirm('Delete this message?')) return;
    try {
      const res = await fetch(`http://localhost:3001/api/messages/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete message');
      fetchMessages();
    } catch (err) {
      console.error('DELETE error:', err);
      alert('Delete failed');
    }
  };

  const handleEdit = async id => {
    try {
      const res = await fetch(`http://localhost:3001/api/messages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content: editingContent }),
      });
      if (!res.ok) throw new Error('Failed to update message');
      setEditingId(null);
      setEditingContent('');
      fetchMessages();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="form-wrapper">
      <div className="auth-form" style={{ width: '100%', maxWidth: '640px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Message Board</h2>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>

        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          <div className="message-list">
            {messages.map(msg => (
              <div className="message-card fade-in" key={msg.id}>
                <div className="message-avatar">
                  {msg.username.charAt(0).toUpperCase()}
                </div>

                <div className="message-body">
                  <strong>{msg.username}</strong>
                  {editingId === msg.id ? (
                    <textarea
                      value={editingContent}
                      onChange={e => setEditingContent(e.target.value)}
                      rows="2"
                      className="edit-textarea"
                    />
                  ) : (
                    <p
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(msg.content),
                      }}
                    />
                  )}
                </div>

                {msg.isOwner && (
                  <div className="edit-btn-group">
                    {editingId === msg.id ? (
                      <>
                        <button className="btn small" onClick={() => handleEdit(msg.id)}>💾</button>
                        <button className="btn small" onClick={() => setEditingId(null)}>❌</button>
                      </>
                    ) : (
                      <>
                        <button className="btn small" onClick={() => {
                          setEditingId(msg.id);
                          setEditingContent(msg.content);
                        }}>✏️</button>
                        <button className="btn small" onClick={() => handleDelete(msg.id)}>🗑</button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="message-form">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write a message..."
            rows="3"
            required
          />
          <button type="submit">Send</button>
        </form>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default Messages;