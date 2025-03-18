const User = require('../models/User');

exports.getUsers = (req, res) => {
    User.getAll((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.getUserById = (req, res) => {
    const { id } = req.params;
    User.getById(id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(results[0]);
    });
};

exports.createUser = (req, res) => {
    User.create(req.body, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, ...req.body });
    });
};

exports.updateUser = (req, res) => {
    const { id } = req.params;
    User.update(id, req.body, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Usuario actualizado correctamente' });
    });
};

exports.deleteUser = (req, res) => {
    const { id } = req.params;
    User.delete(id, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Usuario eliminado correctamente' });
    });
};
