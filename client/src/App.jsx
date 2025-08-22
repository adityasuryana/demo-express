import { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


import './App.css';

// eslint-disable-next-line react-hooks/rules-of-hooks
DataTable.use(DT);

function App() {
  const [tableData, setTableData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    kode_siswa: '',
    nama_siswa: '',
    alamat: '',
    tanggal: '',
    jurusan: ''
  });
  const [message, setMessage] = useState('');

  const handleClose = () => {
    setShow(false);
    setForm({
      kode_siswa: '',
      nama_siswa: '',
      alamat: '',
      tanggal: '',
      jurusan: ''
    });
    setMessage('');
  };
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/students', form);
      setMessage('Data berhasil ditambahkan!');
      setRefresh(r => !r);
      handleClose();
    } catch {
      setMessage('Gagal menambah data');
    }
  };

  useEffect(() => {
    axios.get('http://localhost:3001/students')
      .then(res => {
        function formatTanggal(tgl) {
          const date = new Date(tgl);
          if (isNaN(date)) return tgl; 
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear();
          return `${day}-${month}-${year}`;
        }

        const rows = res.data.map(s => [
          s.kode_siswa,
          s.nama_siswa,
          s.alamat,
          formatTanggal(s.tanggal),
          s.jurusan
        ]);
        setTableData(rows);
      })
      .catch(err => {
        console.error('Gagal mengambil data siswa:', err);
      });
  }, [refresh]);

  const handleDelete = async (kode_siswa) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return;
    try {
      await axios.delete(`http://localhost:3001/students/${kode_siswa}`);
      setRefresh(r => !r);
    } catch {
      alert('Gagal menghapus data');
    }
  };


  
  return (
    <>
      <div>
        <h1>Data Siswa</h1>
        
        <Button className='mt-4 mb-3' variant="primary" onClick={handleShow}>
        + Tambah Siswa
        </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Tambah Siswa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div>
              <label className='form-label'>Kode Siswa</label>
              <input className='form-control'
                type="text"
                name="kode_siswa"
                value={form.kode_siswa}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className='form-label'>Nama Siswa</label>
              <input className='form-control'
                type="text"
                name="nama_siswa"
                value={form.nama_siswa}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className='form-label'>Alamat</label>
              <input className='form-control'
                type="text"
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className='form-label'>Tanggal</label>
              <input className='form-control'
                type="date"
                name="tanggal"
                value={form.tanggal}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className='form-label'>Jurusan</label>
              <input className='form-control'
                type="text"
                name="jurusan"
                value={form.jurusan}
                onChange={handleChange}
                required
              />
            </div>
            {message && <p className='mt-2'>{message}</p>}
            
            <div className='d-flex justify-content-end mt-3'>
              <Button variant="secondary" onClick={handleClose} className='me-2'>Tutup</Button>
              <Button variant="primary" type="submit">Tambah</Button>
            </div>

          </form>
        </Modal.Body>
      </Modal>

        <table className="display table table-hover">
          <thead>
            <tr>
              <th>Kode</th>
              <th>Nama</th>
              <th>Alamat</th>
              <th>Tanggal</th>
              <th>Jurusan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row[0]}>
                <td className='text-center'>{row[0]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>{row[3]}</td>
                <td>{row[4]}</td>
                <td>
                  <button className='btn btn-danger' onClick={() => handleDelete(row[0])}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <footer>
          <p><small>Uji Coba Kompetensi React & Express<br></br><b>Aditya Suryana</b></small></p>
        </footer>
      </div>
    </>
  );
}

export default App;
