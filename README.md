🧩 Pairing Soundbox
📘 Deskripsi

Fitur Pairing Soundbox digunakan untuk menghubungkan perangkat Soundbox dengan Merchant.
Hanya perangkat yang sudah lulus QC (QC OK) yang dapat dipairing.
Selain itu, Merchant ID wajib diisi dengan minimal 3 karakter.

⚙️ Aturan & Validasi

Hanya device yang ada dalam daftar qcOKDevices yang boleh dipair.

merchantId wajib diisi dan minimal 3 karakter.

Jika perangkat sudah pernah dipair, tidak boleh dipair ulang.

Jika semua valid, pairing akan disimpan ke dalam array pairings.

💻 Struktur Data
const qcOKDevices = ["SBX-0001", "SBX-0002"]; // daftar perangkat QC OK
const pairings = []; // hasil pairing akan disimpan di sini

🧠 Alur Program

User mengisi Device ID (QC OK) dan Merchant ID di form.

Saat klik tombol Pair, fungsi pairSoundbox(deviceId, merchantId) dipanggil.

Fungsi melakukan validasi:

Apakah deviceId sudah QC OK?

Apakah merchantId minimal 3 karakter?

Apakah device sudah dipair sebelumnya?

Jika valid → pairing disimpan dan menampilkan pesan sukses.

Jika tidak valid → menampilkan pesan error yang sesuai.

📄 Kode Lengkap
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
    // ====== Data Dummy (Simulasi Database) ======
    const qcOKDevices = ["SBX-0001", "SBX-0002"]; // hanya yang QC OK
    const pairings = []; // hasil pairing akan disimpan di sini

    // ====== Fungsi Pairing ======
    function pairSoundbox(deviceId, merchantId) {
      // 1. Validasi device QC OK
      if (!qcOKDevices.includes(deviceId)) {
        return "❌ Device belum QC OK atau tidak ditemukan.";
      }

      // 2. Validasi merchantId minimal 3 karakter
      if (!merchantId || merchantId.length < 3) {
        return "❌ Merchant ID wajib diisi dan minimal 3 karakter.";
      }

      // 3. Cek apakah sudah dipair sebelumnya
      const alreadyPaired = pairings.find(p => p.deviceId === deviceId);
      if (alreadyPaired) {
        return "⚠️ Device ini sudah dipair dengan merchant lain.";
      }

      // 4. Simpan pairing ke dalam data
      pairings.push({ deviceId, merchantId });

      // 5. Kembalikan pesan sukses
      return `✅ Pairing berhasil: ${deviceId} → ${merchantId}`;
    }

    // ====== Handler Tombol Pair ======
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