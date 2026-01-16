const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const router = require('./routers'); // 👈 routers klasörü

// 🔹 Middleware imports
const logger = require('./middlewares/loggers/log');
const errorHandler = require('./middlewares/validations/errorHandler');

const port = process.env.PORT || 3000;

// 🔹 Global middleware
app.use(cors());
app.use(express.json());
app.use(logger); // 👈 İstek loglama

// 🔹 Static dosyalar (frontend burada)
app.use(express.static(path.join(__dirname, 'public')));

// 🔹 API yönlendirme
// localhost:3000/api/*
app.use('/api', router);

// 🔹 HATA YAKALAYICI (EN SONDA OLMAK ZORUNDA)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Sunucu port ${port} üzerinde çalışıyor... 🚀`);
});
