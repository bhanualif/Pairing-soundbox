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
    return { qcOKDevices: ["SBX-0001", "SBX-0002"], pairings: [], users: [] };
  }

  const raw = fs.readFileSync(DATA_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.users) parsed.users = [];
    if (!parsed.pairings) parsed.pairings = [];
    if (!parsed.qcOKDevices) parsed.qcOKDevices = ["SBX-0001", "SBX-0002"];
    return parsed;
  } catch {
    return { qcOKDevices: ["SBX-0001", "SBX-0002"], pairings: [], users: [] };
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ====== ROUTE REGISTER ======
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  const data = loadData();

  if (!username || !password)
    return res.status(400).json({ message: "❌ Username & password wajib diisi." });

  if (data.users.find((u) => u.username === username))
    return res.status(400).json({ message: "⚠️ Username sudah terdaftar." });

  data.users.push({ username, password });
  saveData(data);

  res.json({ message: "✅ Registrasi berhasil. Silakan login." });
});

// ====== ROUTE LOGIN ======
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const data = loadData();

  const user = data.users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user)
    return res.status(401).json({ message: "❌ Username atau password salah." });

  res.json({ message: "✅ Login berhasil!", username });
});

// ====== ROUTE PAIRING ======
app.post("/api/pair", (req, res) => {
  const { deviceId, merchantId } = req.body;
  const data = loadData();

  if (!data.qcOKDevices.includes(deviceId)) {
    return res.status(400).json({ message: "❌ Device belum QC OK atau tidak ditemukan." });
  }

  if (!merchantId || merchantId.length < 3) {
    return res.status(400).json({ message: "❌ Merchant ID wajib diisi dan minimal 3 karakter." });
  }

  if (data.pairings.find((p) => p.deviceId === deviceId)) {
    return res.status(400).json({ message: "⚠️ Device ini sudah dipair dengan merchant lain." });
  }

  data.pairings.push({ deviceId, merchantId });
  saveData(data);

  res.json({ message: `✅ Pairing berhasil: ${deviceId} → ${merchantId}` });
});

// ====== SERVE FRONTEND ======
const frontendPath = path.join(__dirname, "./");
app.use(express.static(frontendPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "login.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
