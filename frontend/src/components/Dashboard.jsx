import React, { useContext, useState, useMemo } from 'react';
import { TicketContext } from '../context/TicketContext';
import { Search, Plus, Filter, AlertCircle, Clock, CheckCircle, Ticket } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import TicketModal from './TicketModal';

const Dashboard = () => {
  const { tickets, loading } = useContext(TicketContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const metrics = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length,
      resolved: tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length,
      urgent: tickets.filter(t => t.priority === 'Critical' && t.status !== 'Closed' && t.status !== 'Resolved').length
    };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    return tickets
      .filter(t => statusFilter === 'All' ? true : t.status === statusFilter)
      .filter(t => 
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [tickets, searchTerm, statusFilter]);

  const handleOpenModal = (ticket = null) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading tickets...</div>;

  return (
    <>
      {/* Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <MetricCard title="Total Tickets" value={metrics.total} icon={<Ticket className="text-secondary" />} />
        <MetricCard title="Active / Open" value={metrics.open} icon={<Clock color="var(--info)" />} />
        <MetricCard title="Resolved" value={metrics.resolved} icon={<CheckCircle color="var(--success)" />} />
        <MetricCard title="Critical Needs" value={metrics.urgent} icon={<AlertCircle color="var(--danger)" />} highlight={metrics.urgent > 0} />
      </div>

      {/* Toolbar */}
      <div className="flex-between" style={{ marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '300px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search tickets by title, ID, or user..." 
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="form-control" 
            style={{ width: 'auto' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> New Ticket
        </button>
      </div>

      {/* Data Grid */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '1rem 0.5rem' }}>Ticket Info</th>
              <th style={{ padding: '1rem 0.5rem' }}>Priority</th>
              <th style={{ padding: '1rem 0.5rem' }}>Category</th>
              <th style={{ padding: '1rem 0.5rem' }}>Status</th>
              <th style={{ padding: '1rem 0.5rem' }}>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No tickets found matching your criteria.</td>
              </tr>
            ) : (
              filteredTickets.map(ticket => (
                <tr 
                  key={ticket.id} 
                  style={{ borderBottom: '1px solid var(--border-light)', cursor: 'pointer', transition: 'var(--transition)' }}
                  onClick={() => handleOpenModal(ticket)}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{ticket.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {ticket.id.split('-')[0]} • By: {ticket.requestedBy}</div>
                  </td>
                  <td style={{ padding: '1rem 0.5rem' }}><span className={`badge priority-${ticket.priority}`}>{ticket.priority}</span></td>
                  <td style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }}>{ticket.category}</td>
                  <td style={{ padding: '1rem 0.5rem' }}><span className={`badge status-${ticket.status.replace(' ', '')}`}>{ticket.status}</span></td>
                  <td style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {formatDistanceToNow(parseISO(ticket.updatedAt), { addSuffix: true })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <TicketModal 
          ticket={selectedTicket} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
};

const MetricCard = ({ title, value, icon, highlight }) => (
  <div style={{ 
    background: 'var(--bg-surface-elevated)', 
    padding: '1.5rem', 
    borderRadius: 'var(--radius-lg)',
    border: `1px solid ${highlight ? 'var(--danger)' : 'var(--border-light)'}`,
    boxShadow: highlight ? '0 0 15px rgba(239, 68, 68, 0.15)' : 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  }}>
    <div style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
      {icon}
    </div>
    <div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.2rem' }}>{title}</p>
      <h3 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', margin: 0 }}>{value}</h3>
    </div>
  </div>
);

export default Dashboard;
