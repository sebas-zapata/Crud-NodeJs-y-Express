const db = require('../config/db');

class User {
    static getAll(callback) {
        db.query('SELECT * FROM users', callback);
    }

    static getById(id, callback) {
        db.query('SELECT * FROM users WHERE id = ?', [id], callback);
    }

    static create(data, callback) {
        const { name, email, age } = data;
        db.query('INSERT INTO users (name, email, age) VALUES (?, ?, ?)', [name, email, age], callback);
    }

    static update(id, data, callback) {
        const { name, email, age } = data;
        db.query('UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?', [name, email, age, id], callback);
    }

    static delete(id, callback) {
        db.query('DELETE FROM users WHERE id = ?', [id], callback);
    }
}

module.exports = User;
