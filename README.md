🧩 Pairing Soundbox
📘 Deskripsi

Fitur Pairing Soundbox digunakan untuk menghubungkan perangkat Soundbox dengan Merchant.
Hanya perangkat yang sudah lulus QC (QC OK) yang dapat dipairing.
Selain itu, Merchant ID wajib diisi dengan minimal 3 karakter.

⚙️ Aturan & Validasi

Hanya device yang ada dalam daftar qcOKDevices yang boleh dipair.

merchantId wajib diisi dan minimal 3 karakter.

Jika perangkat sudah pernah dipair, tidak boleh dipair ulang.

Jika semua valid, pairing akan disimpan ke dalam array pairings (atau ke server API jika sudah diintegrasi).

💻 Struktur Data (Frontend versi lokal)
const qcOKDevices = ["SBX-0001", "SBX-0002"]; // daftar perangkat QC OK
const pairings = []; // hasil pairing akan disimpan di sini

🧠 Alur Program (Tanpa API)

User mengisi Device ID (QC OK) dan Merchant ID di form.

Saat klik tombol Pair, fungsi pairSoundbox(deviceId, merchantId) dipanggil.

Fungsi melakukan validasi:

Apakah deviceId sudah QC OK?

Apakah merchantId minimal 3 karakter?

Apakah device sudah dipair sebelumnya?

Jika valid → pairing disimpan dan menampilkan pesan sukses.
Jika tidak valid → menampilkan pesan error yang sesuai.

📄 Kode Lengkap (Versi Frontend Lokal)
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Pairing Soundbox</title>
</head>
<body>
  <h3>Pairing Soundbox</h3>
  
  <label>Device ID (QC OK)</label><br>
  <input id="deviceId" placeholder="SBX-0001"><br><br>
  
  <label>Merchant ID</label><br>
  <input id="merchantId" placeholder="M-1001"><br><br>
  
  <button onclick="onPair()">Pair</button>
  
  <p id="result"></p>
  
  <script>
    const qcOKDevices = ["SBX-0001", "SBX-0002"];
    const pairings = [];

    function pairSoundbox(deviceId, merchantId) {
      if (!qcOKDevices.includes(deviceId)) {
        return "❌ Device belum QC OK atau tidak ditemukan.";
      }
      if (!merchantId || merchantId.length < 3) {
        return "❌ Merchant ID wajib diisi dan minimal 3 karakter.";
      }
      const alreadyPaired = pairings.find(p => p.deviceId === deviceId);
      if (alreadyPaired) {
        return "⚠️ Device ini sudah dipair dengan merchant lain.";
      }
      pairings.push({ deviceId, merchantId });
      return `✅ Pairing berhasil: ${deviceId} → ${merchantId}`;
    }

    function onPair() {
      const deviceId = document.getElementById("deviceId").value.trim();
      const merchantId = document.getElementById("merchantId").value.trim();
      const result = pairSoundbox(deviceId, merchantId);
      document.getElementById("result").innerText = result;
      console.log("Pairings Sekarang:", pairings);
    }
  </script>
</body>
</html>

🧩 Contoh Pengujian
Device ID	Merchant ID	Hasil
SBX-0001	M-1001	✅ Pairing berhasil: SBX-0001 → M-1001
SBX-9999	M-1001	❌ Device belum QC OK atau tidak ditemukan.
SBX-0001	M	❌ Merchant ID wajib diisi dan minimal 3 karakter.
SBX-0001	M-2002	⚠️ Device ini sudah dipair dengan merchant lain.
🧾 Penjelasan Singkat Fungsi
Bagian	Fungsi	Penjelasan
qcOKDevices.includes(deviceId)	Validasi QC OK	Pastikan device sudah QC.
merchantId.length < 3	Validasi merchant	Pastikan merchant ID valid.
pairings.find(...)	Cegah duplikasi	Device tidak bisa dipair dua kali.
pairings.push({ ... })	Simpan hasil	Menyimpan pasangan device–merchant.
🌐 Integrasi dengan API (Versi Backend)

Supaya pairing bisa tersimpan di server (bukan array di frontend), sistem diupgrade memakai Express.js API.

📂 Struktur Project
pairing-app/
│
├─ backend/
│   ├─ server.js       ← API backend
│   └─ data.json       ← penyimpanan data pairing
│
└─ frontend/
    └─ index.html      ← tampilan (CSS tetap sama)

⚙️ Backend (Node.js + Express)

File: backend/server.js

const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DATA_FILE = "./data.json";

function loadData() {
  if (!fs.existsSync(DATA_FILE)) return { qcOKDevices: ["SBX-0001", "SBX-0002"], pairings: [] };
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.post("/api/pair", (req, res) => {
  const { deviceId, merchantId } = req.body;
  const data = loadData();

  if (!data.qcOKDevices.includes(deviceId)) {
    return res.status(400).json({ message: "❌ Device belum QC OK atau tidak ditemukan." });
  }

  if (!merchantId || merchantId.length < 3) {
    return res.status(400).json({ message: "❌ Merchant ID wajib diisi dan minimal 3 karakter." });
  }

  if (data.pairings.find(p => p.deviceId === deviceId)) {
    return res.status(400).json({ message: "⚠️ Device ini sudah dipair dengan merchant lain." });
  }

  data.pairings.push({ deviceId, merchantId });
  saveData(data);

  res.json({ message: `✅ Pairing berhasil: ${deviceId} → ${merchantId}` });
});

app.listen(PORT, () => console.log(`✅ Server API berjalan di http://localhost:${PORT}`));

📄 Data Awal (data.json)
{
  "qcOKDevices": ["SBX-0001", "SBX-0002"],
  "pairings": []
}

🖥️ Frontend (Tetap CSS Asli)
<script>
  const API_URL = "http://localhost:3000/api";

  async function onPair() {
    const deviceId = document.getElementById("deviceId").value.trim();
    const merchantId = document.getElementById("merchantId").value.trim();

    try {
      const res = await fetch(`${API_URL}/pair`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId, merchantId })
      });

      const data = await res.json();
      document.getElementById("result").innerText = data.message;
    } catch (err) {
      document.getElementById("result").innerText = "⚠️ Gagal menghubungi server API.";
    }
  }
</script>

🚀 Cara Menjalankan
1️⃣ Jalankan Backend
cd backend
npm init -y
npm install express cors
node server.js


Server berjalan di: http://localhost:3000

2️⃣ Jalankan Frontend

Buka file frontend/index.html di browser (pakai Live Server lebih baik).

Isi form:

Device ID: SBX-0001

Merchant ID: M-1001

Klik Pair

Muncul hasil:

✅ Pairing berhasil: SBX-0001 → M-1001


Hasil pairing juga otomatis tersimpan di file backend/data.json.

🧾 Ringkasan Integrasi API
Endpoint	Method	Deskripsi
/api/pair	POST	Melakukan pairing device dengan merchant
/api/pairings	GET	(opsional) Menampilkan semua data pairing
/api/qc/add	POST	(opsional) Menambahkan device QC OK baru
🎯 Kesimpulan

Versi awal: semua data pairing disimpan di frontend (array JavaScript).

Versi API: data pairing dan QC disimpan di server (file JSON) via Express.js API.

CSS dan tampilan tidak diubah sama sekali, hanya bagian script yang dihubungkan ke API.
