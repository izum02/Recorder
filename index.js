const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

let sessionHistory = [];

app.set('trust proxy', true); // IP取得用

app.get('/api/log', async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;

  try {
    const response = await axios.get(`https://ipinfo.io/${ip}/json`);
    const info = response.data;

    const now = new Date().toISOString();
    const session = {
      socketId: `manual-${Date.now()}`,
      ip: info.ip,
      city: info.city,
      region: info.region,
      country: info.country,
      loc: info.loc,
      connectTime: now,
      disconnectTime: "-", // 無し
    };

    sessionHistory.push(session);
    res.json({ success: true, session });
  } catch (err) {
    console.error('IP情報取得失敗:', err.message);
    res.status(500).json({ error: '位置情報の取得に失敗しました。' });
  }
});

app.get('/api/sessions', (req, res) => {
  res.json(sessionHistory);
});

app.listen(PORT, () => {
  console.log(`サーバー起動: http://localhost:${PORT}`);
});
