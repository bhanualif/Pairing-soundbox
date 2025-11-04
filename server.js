const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ====== FILE DATA ======
const DATA_FILE = "./data.json";

// ====== FUNGSI MEMBACA & MENYIMPAN DATA ======
function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    return { qcOKDevices: ["SBX-0001", "SBX-0002"], pairings: [] };
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ====== ROUTE API ======

// GET semua data pairing
app.get("/api/pairings", (req, res) => {
  const data = loadData();
  res.json(data.pairings);
});

// POST untuk proses pairing soundbox
app.post("/api/pair", (req, res) => {
  const { deviceId, merchantId } = req.body;
  const data = loadData();

  if (!data.qcOKDevices.includes(deviceId)) {
    return res
      .status(400)
      .json({ message: "❌ Device belum QC OK atau tidak ditemukan." });
  }

  if (!merchantId || merchantId.length < 3) {
    return res
      .status(400)
      .json({ message: "❌ Merchant ID wajib diisi dan minimal 3 karakter." });
  }

  if (data.pairings.find((p) => p.deviceId === deviceId)) {
    return res
      .status(400)
      .json({ message: "⚠️ Device ini sudah dipair dengan merchant lain." });
  }

  data.pairings.push({ deviceId, merchantId });
  saveData(data);

  res.json({ message: `✅ Pairing berhasil: ${deviceId} → ${merchantId}` });
});

// ====== ROUTE FRONTEND (index.html) ======
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

// Route default ke index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ====== JALANKAN SERVER ======
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
