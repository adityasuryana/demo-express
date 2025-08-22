create database student_db;

use student_db;

create table students (
	kode_siswa INT(20) PRIMARY KEY,
	nama_siswa VARCHAR(100),
	alamat TEXT,
	tanggal DATE,
	jurusan VARCHAR(50)
);

insert into students(kode_siswa, nama_siswa, alamat, tanggal, jurusan) values
	(2,"Gema", "Bandung", "2021-12-01", "Teknik Informatika");
    
select * from students;

delete from students where kode_siswa = 1;
