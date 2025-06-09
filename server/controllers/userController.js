const db = require('../config/db');

exports.getUsers = (req, res) => {
  db.query('SELECT * FROM users', (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};

exports.getUser = (req, res) => {
  db.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result[0]);
  });
};

exports.createUser = (req, res) => {
  const { name, email, age } = req.body;
  db.query('INSERT INTO users (name, email, age) VALUES (?, ?, ?)', [name, email, age], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId, name, email, age });
  });
};

exports.updateUser = (req, res) => {
  const { name, email, age } = req.body;
  db.query('UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?', [name, email, age, req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'User updated' });
  });
};

exports.deleteUser = (req, res) => {
  db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'User deleted' });
  });
};