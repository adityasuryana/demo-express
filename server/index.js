const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = process.env.PORT || 3001;

const cors = require('cors');
app.use(cors());
app.use(express.json());

// Koneksi ke database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'student_db',
    port: 3306
});
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});


// Add siswa baru
app.post('/students', (req, res) => {
    const { kode_siswa, nama_siswa, alamat, tanggal, jurusan } = req.body;
    if (!kode_siswa || !nama_siswa || !alamat || !tanggal || !jurusan) {
        return res.status(400).json({ error: 'Isi semua field' });
    }

    db.query('SELECT * FROM students WHERE kode_siswa = ?', [kode_siswa], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            return res.status(409).json({ error: 'kode_siswa sudah ada' });
        }
        db.query(
            'INSERT INTO students (kode_siswa, nama_siswa, alamat, tanggal, jurusan) VALUES (?, ?, ?, ?, ?)',
            [kode_siswa, nama_siswa, alamat, tanggal, jurusan],
            (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ kode_siswa, nama_siswa, alamat, tanggal, jurusan });
            }
        );
    });
});

// Get semua siswa
app.get('/students', (req, res) => {
    db.query('SELECT * FROM students', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get siswa by kode_siswa
app.get('/students/:kode_siswa', (req, res) => {
    db.query('SELECT * FROM students WHERE kode_siswa = ?', [req.params.kode_siswa], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Siswa tidak ada' });
        res.json(results[0]);
    });
});

// update siswa by kode_siswa
app.put('/students/:kode_siswa', (req, res) => {
    const { nama_siswa, alamat, tanggal, jurusan } = req.body;
    if (!nama_siswa || !alamat || !tanggal || !jurusan) {
        return res.status(400).json({ error: 'Isi semua field' });
    }
    db.query(
        'UPDATE students SET nama_siswa = ?, alamat = ?, tanggal = ?, jurusan = ? WHERE kode_siswa = ?',
        [nama_siswa, alamat, tanggal, jurusan, req.params.kode_siswa],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Siswa tidak ada' });
            res.json({ kode_siswa: req.params.kode_siswa, nama_siswa, alamat, tanggal, jurusan });
        }
    );
});

// delete siswa by kode_siswa
app.delete('/students/:kode_siswa', (req, res) => {
    db.query('DELETE FROM students WHERE kode_siswa = ?', [req.params.kode_siswa], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Siswa tidak ada' });
        res.json({ message: 'Siswa dihapus' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
