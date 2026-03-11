const db = require('../config/db');

exports.getTasks = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tasks WHERE user_id = ?', [req.user.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data tugas: ' + error.message });
    }
};

exports.createTask = async (req, res) => {
    try {
        const { title, description, deadline, status } = req.body;
        await db.query('INSERT INTO tasks (user_id, title, description, deadline, status) VALUES (?, ?, ?, ?, ?)', 
            [req.user.id, title, description, deadline, status || 'pending']);
        res.status(201).json({ message: 'Tugas berhasil dibuat' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal membuat tugas: ' + error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, deadline, status } = req.body;
        await db.query('UPDATE tasks SET title=?, description=?, deadline=?, status=? WHERE id=? AND user_id=?', 
            [title, description, deadline, status, id, req.user.id]);
        res.json({ message: 'Tugas berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal memperbarui tugas: ' + error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM tasks WHERE id=? AND user_id=?', [id, req.user.id]);
        res.json({ message: 'Tugas berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menghapus tugas: ' + error.message });
    }
};
