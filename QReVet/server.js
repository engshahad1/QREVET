// ✅ server.js - نسخة Base64 بدون رفع ملفات
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = 5000;

const users = [
  { username: 'vet1', password: '1234', role: 'vet' },
  { username: 'lab1', password: '5678', role: 'lab' }
];

app.use(session({ secret: 'qrevet-secret-key', resave: false, saveUninitialized: true }));
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // لدعم الصور Base64
app.use(express.static(path.join(__dirname, 'public')));

let animals = [];

app.post('/api/animals', (req, res) => {
  const animal = req.body;
  animal.id = animals.length + 1;
  animal.status = "قيد الإجراء";
  animals.push(animal);
  res.json({ success: true, animal });
});

app.get('/api/animals', (req, res) => {
  res.json({ success: true, data: animals });
});

app.get('/animal/:id', (req, res) => {
  res.sendFile(__dirname + '/public/animal-info.html');
});

app.put('/api/animals/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { result, notes } = req.body;
  const animal = animals.find(a => a.id === id);
  if (animal) {
    animal.result = result;
    animal.notes = notes;
    animal.status = "تم الإنجاز";
    res.json({ success: true, data: animal });
  } else {
    res.status(404).json({ success: false, message: "لم يتم العثور على الحيوان" });
  }
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    req.session.user = user;
    res.json({ success: true, role: user.role });
  } else {
    res.status(401).json({ success: false, message: 'بيانات الدخول غير صحيحة' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 QReVet server is running on http://localhost:${PORT}`);
});
