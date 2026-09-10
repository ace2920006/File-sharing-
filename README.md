# 🛡 SecureShare - Privacy-Focused Encrypted File Sharing Platform

SecureShare is a modern, privacy-focused file-sharing web application built with **React, Express, Node.js, and MongoDB**. It enables anonymous, secure file uploads with AES-256-GCM encryption on disk, optional password locks, custom expiration timers, self-destruct download limits, and QR code sharing.

---
## ✨ Features

- 🔒 **AES-256-GCM Disk Encryption**: Files are encrypted before being written to disk.
- 🔑 **Optional Password Locks**: Protect downloads with bcrypt-hashed passwords.
- ⏳ **Custom Link Expiration**: Set expiration (1h, 6h, 24h, 7d, 30d, or never).
- 💥 **Self-Destruct & Download Limits**: Limit downloads (1-time download or custom counts).
- 🧹 **Automated Background Cleanup**: Background cron purges expired files and DB records.
- 📱 **QR Code Link Sharing**: Scan QR code to download directly on mobile devices.
- 🎨 **Modern Dark Glassmorphic UI**: Built with Tailwind CSS, Space Grotesk & Plus Jakarta Sans typography.
---

## 📁 Project Structure
```
SecureShare/
├── client/                 # Vite + React Frontend
│   ├── src/
│   │   ├── components/    # Navbar, Footer, UploadCard, ProgressBar, PasswordModal, QRCodeCard, FilePreview
│   │   ├── pages/         # Home, Upload, Download, Error
│   │   ├── services/      # Axios API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                 # Express + Node.js Backend
│   ├── config/            # Database connection
│   ├── controllers/       # Upload, Info, Verify, Download handlers
│   ├── middleware/        # Multer storage, Rate limiting
│   ├── models/            # Mongoose File Schema
│   ├── routes/            # File API routes
│   ├── services/          # AES-256-GCM Encryption & Background Cron Cleanup
│   └── server.js
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```
*Or manually:*
```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure Environment Variables
Verify or update `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/secureshare
ENCRYPTION_KEY=4f8b92c10d3e5a7f6b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a
MAX_FILE_SIZE_MB=100
CLIENT_URL=http://localhost:5173
```

### 3. Run Development Servers
In separate terminal windows:

**Backend Server (Port 5000):**
```bash
npm run dev:server
```

**Frontend App (Port 5173):**
```bash
npm run dev:client
```

---

## 📡 API Endpoints

- `POST /api/files/upload` - Encrypt & upload file with options.
- `GET /api/files/info/:token` - Get public file metadata.
- `POST /api/files/verify` - Verify password for protected link.
- `GET /api/files/:token` - Decrypt and stream file download.

---

## 📄 License
MIT License
