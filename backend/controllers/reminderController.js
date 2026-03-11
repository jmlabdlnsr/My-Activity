const db = require('../config/db');

exports.getReminders = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM reminders WHERE user_id = ?', [req.user.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data pengingat: ' + error.message });
    }
};

exports.createReminder = async (req, res) => {
    try {
        const { title, reminder_time } = req.body;
        await db.query('INSERT INTO reminders (user_id, title, reminder_time) VALUES (?, ?, ?)', 
            [req.user.id, title, reminder_time]);
        res.status(201).json({ message: 'Pengingat berhasil dibuat' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal membuat pengingat: ' + error.message });
    }
};

exports.updateReminder = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, reminder_time } = req.body;
        await db.query('UPDATE reminders SET title=?, reminder_time=? WHERE id=? AND user_id=?', 
            [title, reminder_time, id, req.user.id]);
        res.json({ message: 'Pengingat berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal memperbarui pengingat: ' + error.message });
    }
};

exports.deleteReminder = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM reminders WHERE id=? AND user_id=?', [id, req.user.id]);
        res.json({ message: 'Pengingat berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menghapus pengingat: ' + error.message });
    }
};
