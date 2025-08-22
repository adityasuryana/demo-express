import { useState, useEffect } from 'react';
import AddDataForm from './AddDataForm';
import axios from 'axios';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';

import './App.css';

// eslint-disable-next-line react-hooks/rules-of-hooks
DataTable.use(DT);

function App() {
  const [tableData, setTableData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3001/students')
      .then(res => {
        // Ubah data dari objek ke array sesuai urutan kolom
        const rows = res.data.map(s => [
          s.kode_siswa,
          s.nama_siswa,
          s.alamat,
          s.tanggal,
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
        {/* <AddDataForm /> */}
        {/* <button className='btn-tambah'>Tambah Siswa</button> */}
        <table className="display table">
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
                <td>{row[0]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>{row[3]}</td>
                <td>{row[4]}</td>
                <td>
                  <button onClick={() => handleDelete(row[0])} style={{background: 'red', color: 'white', padding:'7px 5px'}}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <footer>
          <p><small>Uji Coba Kompetensi React & Express<br></br>Aditya Suryana</small></p>
        </footer>
      </div>
    </>
  );
}

export default App;
