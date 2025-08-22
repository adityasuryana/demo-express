import React, { useState } from 'react';

const AddDataForm = () => {
  const [form, setForm] = useState({
    kode_siswa: '',
    nama_siswa: '',
    alamat: '',
    tanggal: '',
    jurusan: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
  const res = await fetch('http://localhost:3001/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMessage('Data berhasil ditambahkan!');
        setForm({
          kode_siswa: '',
          nama_siswa: '',
          alamat: '',
          tanggal: '',
          jurusan: ''
        });
      } else {
        setMessage('Gagal menambah data');
      }
    } catch {
      setMessage('Terjadi kesalahan');
    }
  };

  return (
    <div>
      <h2>Tambah Data</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Kode Siswa:</label>
          <input
            type="text"
            name="kode_siswa"
            value={form.kode_siswa}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Nama Siswa:</label>
          <input
            type="text"
            name="nama_siswa"
            value={form.nama_siswa}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Alamat:</label>
          <input
            type="text"
            name="alamat"
            value={form.alamat}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Tanggal:</label>
          <input
            type="date"
            name="tanggal"
            value={form.tanggal}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Jurusan:</label>
          <input
            type="text"
            name="jurusan"
            value={form.jurusan}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Tambah</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddDataForm;
