// Express API entry point with JWT integration
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('./jwt');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Example: public route
db = null; // TODO: connect your DB here

app.post('/login', async (req, res) => {
  // TODO: validate user credentials from DB
  const { email, password } = req.body;
  // Replace with real user lookup
  const user = { id: 1, email, role_id: 1 };
  // If credentials valid:
  const token = jwt.generateToken(user);
  res.json({ success: true, token });
});

// Example: protected route
app.get('/protected', jwt.authenticateJWT, (req, res) => {
  res.json({ success: true, message: 'Accès autorisé', user: req.user });
});

// Example: admin route
app.get('/admin', jwt.authenticateJWT, jwt.requireAdmin, (req, res) => {
  res.json({ success: true, message: 'Bienvenue admin', user: req.user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
