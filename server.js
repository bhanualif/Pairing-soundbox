const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DATA_FILE = "./data.json";

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    return { qcOKDevices: ["SBX-0001", "SBX-0002"], pairings: [] };
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET semua pairing
app.get("/api/pairings", (req, res) => {
  const data = loadData();
  res.json(data.pairings);
});

// POST pair soundbox
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

app.listen(PORT, () => console.log(`✅ Server API running at http://localhost:${PORT}`));
