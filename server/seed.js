const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_FILE = path.join(__dirname, 'data', 'db.json');

const categories = ['Hardware', 'Software', 'Network', 'Account Access', 'Other'];
const priorities = ['Low', 'Medium', 'High', 'Critical'];
const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];

const generateTickets = () => {
  const tickets = [];

  const templates = [
    { title: 'Password reset required', category: 'Account Access', prior: 'High', desc: 'User locked out of active directory account.' },
    { title: 'Slow computer performance', category: 'Hardware', prior: 'Medium', desc: 'Laptop is freezing when opening Chrome.' },
    { title: 'Printer offline in HR', category: 'Hardware', prior: 'Medium', desc: 'Cannot connect to the 3rd floor Ricoh printer.' },
    { title: 'Outlook not syncing', category: 'Software', prior: 'High', desc: 'Emails stuck in outbox since 9 AM.' },
    { title: 'VPN connection dropping', category: 'Network', prior: 'Critical', desc: 'Remote users cannot stay connected to the corporate VPN.' },
    { title: 'Requires Adobe Creative Cloud', category: 'Software', prior: 'Low', desc: 'Requesting an upgrade to include Illustrator and Photoshop.' },
    { title: 'Mouse double clicking', category: 'Hardware', prior: 'Low', desc: 'Logitech wireless mouse registers double clicks on single click.' },
    { title: 'Blue screen on boot', category: 'Hardware', prior: 'Critical', desc: 'Dell laptop gets stuck on recovery screen.' },
    { title: 'Cannot access shared drive', category: 'Network', prior: 'High', desc: 'Getting permission denied error when mapping Z: drive.' },
    { title: 'Zoom audio issues', category: 'Software', prior: 'Medium', desc: 'Microphone not being recognized in Zoom meetings.' },
  ];

  // Helper to get random item
  const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
  
  // Calculate a past date
  const getPastDate = (daysAgo) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString();
  };

  for (let i = 0; i < 25; i++) {
    const template = templates[i % templates.length];
    const status = getRandom(statuses);
    
    // SLA Simulation
    const createdDaysAgo = Math.floor(Math.random() * 5) + 1; 
    const createdAt = getPastDate(createdDaysAgo);
    const updatedAt = getPastDate(Math.max(0, createdDaysAgo - 1));

    const resolutionNotes = [];
    if (status === 'Resolved' || status === 'Closed' || status === 'In Progress') {
      resolutionNotes.push({
        id: uuidv4(),
        text: 'Initial review completed. Investigating the root cause.',
        author: 'Tech Support',
        timestamp: getPastDate(createdDaysAgo - 0.5)
      });
    }

    if (status === 'Resolved' || status === 'Closed') {
      resolutionNotes.push({
        id: uuidv4(),
        text: `Issue resolved. Walked user through steps. Confirmed working.`,
        author: 'Tech Support',
        timestamp: updatedAt
      });
    }

    tickets.push({
      id: uuidv4(),
      title: `${template.title} - ${i + 1}`,
      description: template.desc,
      priority: template.prior,
      category: template.category,
      status: status,
      requestedBy: `User ${Math.floor(Math.random() * 100) + 1}`,
      assignedTo: (status === 'Open') ? null : 'Tech. Admin',
      createdAt,
      updatedAt,
      resolutionNotes
    });
  }

  return tickets;
};

const run = () => {
  const directory = path.join(__dirname, 'data');
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  
  const tickets = generateTickets();
  fs.writeFileSync(DB_FILE, JSON.stringify({ tickets }, null, 2));
  console.log('Successfully seeded 25 mock IT tickets into db.json');
};

run();
