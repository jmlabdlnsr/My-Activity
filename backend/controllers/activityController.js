const db = require('../config/db');

exports.getActivities = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM daily_activities WHERE user_id = ?', [req.user.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data aktivitas: ' + error.message });
    }
};

exports.createActivity = async (req, res) => {
    try {
        const { activity_title, description, activity_date } = req.body;
        await db.query('INSERT INTO daily_activities (user_id, activity_title, description, activity_date) VALUES (?, ?, ?, ?)', 
            [req.user.id, activity_title, description, activity_date]);
        res.status(201).json({ message: 'Aktivitas berhasil dicatat' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal mencatat aktivitas: ' + error.message });
    }
};

exports.updateActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const { activity_title, description, activity_date } = req.body;
        await db.query('UPDATE daily_activities SET activity_title=?, description=?, activity_date=? WHERE id=? AND user_id=?', 
            [activity_title, description, activity_date, id, req.user.id]);
        res.json({ message: 'Aktivitas berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal memperbarui aktivitas: ' + error.message });
    }
};

exports.deleteActivity = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM daily_activities WHERE id=? AND user_id=?', [id, req.user.id]);
        res.json({ message: 'Aktivitas berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menghapus aktivitas: ' + error.message });
    }
};
