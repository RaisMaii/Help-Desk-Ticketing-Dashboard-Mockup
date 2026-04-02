import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, Users, Settings, LogOut, LifeBuoy } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Ticket size={20} />, label: 'All Tickets', path: '/tickets' },
    { icon: <Users size={20} />, label: 'Users', path: '/users' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', color: 'var(--primary)' }}>
        <LifeBuoy size={28} />
        <h2 style={{ fontSize: '1.25rem', letterSpacing: '0.05em' }}>IT Support</h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>Main Menu</p>
        
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              color: isActive ? 'white' : 'var(--text-secondary)',
              backgroundColor: isActive ? 'var(--primary)' : 'transparent',
              transition: 'var(--transition)',
              pointerEvents: item.path !== '/' ? 'none' : 'auto', // Disabling mock links
              opacity: item.path !== '/' ? 0.6 : 1
            })}
          >
            {item.icon}
            <span style={{ fontWeight: 500 }}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
        <button 
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', width: '100%', padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)' }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = 'var(--danger)'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          <LogOut size={20} />
          <span style={{ fontWeight: 500 }}>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
