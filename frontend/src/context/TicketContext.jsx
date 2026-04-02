import React, { createContext, useState, useEffect } from 'react';

export const TicketContext = createContext();

const API_URL = 'http://localhost:3001/api/tickets';

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setTickets(data);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const createTicket = async (ticketData) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData),
      });
      const newTicket = await res.json();
      setTickets([...tickets, newTicket]);
      return newTicket;
    } catch (error) {
      console.error('Error creating ticket', error);
    }
  };

  const updateTicket = async (id, updateData) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      const updatedTicket = await res.json();
      setTickets(tickets.map((t) => (t.id === id ? updatedTicket : t)));
      return updatedTicket;
    } catch (error) {
      console.error('Error updating ticket', error);
    }
  };

  return (
    <TicketContext.Provider value={{ tickets, loading, fetchTickets, createTicket, updateTicket }}>
      {children}
    </TicketContext.Provider>
  );
};
