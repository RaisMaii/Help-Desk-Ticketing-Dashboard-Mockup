import React, { useState, useContext } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, Clock, User, Tag } from 'lucide-react';
import { TicketContext } from '../context/TicketContext';
import { format, parseISO } from 'date-fns';

const TicketModal = ({ ticket, onClose }) => {
  const { createTicket, updateTicket } = useContext(TicketContext);
  const isNew = !ticket;

  // New ticket state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    category: 'Other',
    requestedBy: ''
  });

  // Update ticket state
  const [status, setStatus] = useState(ticket?.status || '');
  const [priority, setPriority] = useState(ticket?.priority || '');
  const [newNote, setNewNote] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    await createTicket(formData);
    onClose();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateTicket(ticket.id, { status, priority, newNote });
    onClose();
  };

  return createPortal(
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 50, padding: '1rem'
    }}>
      <div className="animate-fade-in glass-panel" style={{
        width: '100%', maxWidth: '700px', maxHeight: '90vh',
        display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-surface)'
      }}>
        {/* Header */}
        <div className="flex-between" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
              {isNew ? 'Create New Ticket' : `Ticket ${ticket.id.split('-')[0]}`}
            </h2>
            {!isNew && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{ticket.title}</p>}
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', background: 'transparent' }}><X size={24} /></button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
          {isNew ? (
            <form id="ticket-form" onSubmit={handleCreate}>
              <div className="input-group">
                <label className="input-label">Ticket Title</label>
                <input required type="text" className="form-control" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="E.g., Cannot access printer" />
              </div>
              <div className="input-group">
                <label className="input-label">Requested By</label>
                <input required type="text" className="form-control" value={formData.requestedBy} onChange={e => setFormData({...formData, requestedBy: e.target.value})} placeholder="Employee Name" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Category</label>
                  <select className="form-control" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option>Hardware</option><option>Software</option><option>Network</option><option>Account Access</option><option>Other</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Priority</label>
                  <select className="form-control" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                    <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea required className="form-control" rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Detailed description of the issue..."></textarea>
              </div>
            </form>
          ) : (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div><label className="input-label" style={{display: 'flex', alignItems: 'center', gap: '0.4rem'}}><User size={14}/> Requester</label><div style={{fontWeight: 500}}>{ticket.requestedBy}</div></div>
                <div><label className="input-label" style={{display: 'flex', alignItems: 'center', gap: '0.4rem'}}><Tag size={14}/> Category</label><div style={{fontWeight: 500}}>{ticket.category}</div></div>
                <div><label className="input-label" style={{display: 'flex', alignItems: 'center', gap: '0.4rem'}}><Clock size={14}/> Created</label><div style={{fontWeight: 500, fontSize: '0.9rem'}}>{format(parseISO(ticket.createdAt), 'MMM d, yyyy HH:mm')}</div></div>
              </div>
              
              <div style={{ marginBottom: '2rem' }}>
                <label className="input-label">Description</label>
                <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}>
                  {ticket.description}
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>Management & SLA</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">Update Status</label>
                    <select className="form-control" value={status} onChange={e => setStatus(e.target.value)}>
                      <option>Open</option><option>In Progress</option><option>Resolved</option><option>Closed</option>
                    </select>
                  </div>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">Update Priority</label>
                    <select className="form-control" value={priority} onChange={e => setPriority(e.target.value)}>
                      <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>Resolution Log</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  {ticket.resolutionNotes && ticket.resolutionNotes.map(note => (
                    <div key={note.id} style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                      <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{note.author}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{format(parseISO(note.timestamp), 'MMM d, h:mm a')}</span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{note.text}</p>
                    </div>
                  ))}
                  {ticket.resolutionNotes?.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No internal notes or resolution steps yet.</p>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="text" className="form-control" value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Add an internal note or resolution update..." />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-between" style={{ padding: '1.25rem', borderTop: '1px solid var(--border-light)', background: 'var(--bg-main)' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button 
            type={isNew ? "submit" : "button"} 
            form={isNew ? "ticket-form" : undefined}
            className="btn btn-primary" 
            onClick={!isNew ? handleUpdate : undefined}
          >
            {isNew ? 'Submit Ticket' : 'Save Updates'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TicketModal;
