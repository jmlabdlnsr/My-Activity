# My Activity
Aplikasi web sederhana untuk bantu mahasiswa/pelajar mengelola aktivitas harian, tugas, jadwal kuliah, dan pengingat. Project ini misah antara backend (Express) dan frontend (Vue).

## Fitur
- Login & Register (pake JWT)
- Input jadwal kuliah/rutinitas
- List tugas (To-Do List) dengan deadline
- Pengingat (Reminder)
- Catatan aktivitas harian

## Cara Menjalankan Project

### 1. Persiapan Database
- Buat database di MySQL/Laragon, namanya bebas (contoh: `my_activity`).
- Import file `database.sql` ke database tersebut.

### 2. Setup Backend
- Buka folder `backend`.
- Jalankan `npm install`.
- Buat file `.env`, lalu isi konfigurasinya (sesuaikan dengan database Anda):
  ```env
  PORT=5000
  DB_HOST=localhost
  DB_USER=root
  DB_PASS=
  DB_NAME=my_activity
  JWT_SECRET=bebas_apa_saja
  JWT_REFRESH_SECRET=bebas_apa_saja_2
  ```
- Jalankan server dengan perintah: `npm run dev`

### 3. Setup Frontend
- Buka folder `frontend`.
- Jalankan `npm install`.
- Jalankan aplikasi dengan perintah: `npm run dev`
- Buka browser di alamat yang muncul (biasanya `http://localhost:5173`).

## Stack yang Digunakan
- **Backend:** Node.js, Express, MySQL2, JWT, Bcrypt.
- **Frontend:** Vue 3, Vite, Tailwind CSS, Axios.

