const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;
const DB_FILE = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(express.json());

// Initialize DB if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ tickets: [] }, null, 2));
}

// Helper to read db
const readDB = () => {
  const data = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(data);
};

// Helper to write db
const writeDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// Root route for sanity check
app.get('/', (req, res) => {
  res.send('IT Help Desk API is running. The frontend is available at http://localhost:5173');
});

// GET all tickets
app.get('/api/tickets', (req, res) => {
  const db = readDB();
  res.json(db.tickets);
});

// GET single ticket
app.get('/api/tickets/:id', (req, res) => {
  const db = readDB();
  const ticket = db.tickets.find((t) => t.id === req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
  res.json(ticket);
});

// POST new ticket
app.post('/api/tickets', (req, res) => {
  const db = readDB();
  const { title, description, priority, category, requestedBy } = req.body;
  
  const newTicket = {
    id: uuidv4(),
    title,
    description,
    priority: priority || 'Low',
    category: category || 'Other',
    status: 'Open',
    requestedBy: requestedBy || 'Anonymous',
    assignedTo: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    resolutionNotes: [],
  };
  
  db.tickets.push(newTicket);
  writeDB(db);
  
  res.status(201).json(newTicket);
});

// PATCH ticket (update status, priority, assign to, or add resolution log)
app.patch('/api/tickets/:id', (req, res) => {
  const db = readDB();
  const index = db.tickets.findIndex((t) => t.id === req.params.id);
  
  if (index === -1) return res.status(404).json({ error: 'Ticket not found' });
  
  const ticket = db.tickets[index];
  const { status, priority, assignedTo, newNote } = req.body;
  
  if (status) ticket.status = status;
  if (priority) ticket.priority = priority;
  if (assignedTo !== undefined) ticket.assignedTo = assignedTo;
  
  if (newNote) {
    ticket.resolutionNotes.push({
      id: uuidv4(),
      text: newNote,
      author: 'Tech Support',
      timestamp: new Date().toISOString()
    });
  }
  
  ticket.updatedAt = new Date().toISOString();
  db.tickets[index] = ticket;
  writeDB(db);
  
  res.json(ticket);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
