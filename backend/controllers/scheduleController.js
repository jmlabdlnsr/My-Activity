const db = require('../config/db');

exports.getSchedules = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM schedules WHERE user_id = ?', [req.user.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data jadwal: ' + error.message });
    }
};

exports.createSchedule = async (req, res) => {
    try {
        const { course_name, day, start_time, end_time, location } = req.body;
        await db.query('INSERT INTO schedules (user_id, course_name, day, start_time, end_time, location) VALUES (?, ?, ?, ?, ?, ?)', 
            [req.user.id, course_name, day, start_time, end_time, location]);
        res.status(201).json({ message: 'Jadwal berhasil ditambahkan' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menambahkan jadwal: ' + error.message });
    }
};

exports.updateSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const { course_name, day, start_time, end_time, location } = req.body;
        await db.query('UPDATE schedules SET course_name=?, day=?, start_time=?, end_time=?, location=? WHERE id=? AND user_id=?', 
            [course_name, day, start_time, end_time, location, id, req.user.id]);
        res.json({ message: 'Jadwal berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal memperbarui jadwal: ' + error.message });
    }
};

exports.deleteSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM schedules WHERE id=? AND user_id=?', [id, req.user.id]);
        res.json({ message: 'Jadwal berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menghapus jadwal: ' + error.message });
    }
};
