# Implementation Plan - SecureShare Full Stack Web Application

Build **SecureShare**, a privacy-focused, anonymous file-sharing platform according to the specifications in [development.md](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/development.md). The application allows users to securely upload and share files without registering an account, featuring cryptographic tokens, optional password protection (bcrypt), AES-256-GCM server-side file encryption, download limits, expiration dates, automatic background cleanup, and a modern React UI with QR code generation.

---

## User Review Required

> [!IMPORTANT]
> **Database & Fallback Setup**: We will configure MongoDB connection using `mongoose`. To ensure smooth out-of-the-box development, we will include fallback connection handling so the server provides clear error reporting or connection status if a local MongoDB instance is not active.
> 
> **File Storage & Security**: Files uploaded to `server/uploads/` will be encrypted using `AES-256-GCM` before being written to disk, so raw files are never stored unencrypted. A 32-byte master encryption secret will be defined in `.env`.

---

## Proposed Changes

### Root Directory

#### [NEW] [package.json](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/package.json)
- Monorepo root script definitions (`npm run dev`, `npm run start:server`, `npm run dev:client`, `npm run install:all`) for single-command developer experience.

---

### Backend (`server/`)

#### [NEW] [server/package.json](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/server/package.json)
- Express, Mongoose, Multer, Helmet, bcryptjs, cors, dotenv, express-rate-limit, express-validator, node-cron.

#### [NEW] [server/.env.example](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/server/.env.example)
- Configuration templates: `PORT`, `MONGO_URI`, `ENCRYPTION_KEY`, `MAX_FILE_SIZE_MB`, `CLIENT_URL`.

#### [NEW] [server/config/db.js](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/server/config/db.js)
- MongoDB connection lifecycle manager using Mongoose.

#### [NEW] [server/models/File.js](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/server/models/File.js)
- Schema matching specification: `filename`, `originalName`, `mimeType`, `size`, `token`, `encryptedPath`, `password`, `expiresAt`, `downloadLimit`, `downloadCount`, `createdAt`.

#### [NEW] [server/services/encryptionService.js](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/server/services/encryptionService.js)
- AES-256-GCM stream/buffer encryption and decryption functions for uploaded file streams.

#### [NEW] [server/services/cleanupService.js](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/server/services/cleanupService.js)
- Background job (cron) to purge expired files or files exceeding `downloadLimit` from disk storage and database.

#### [NEW] [server/middleware/uploadMiddleware.js](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/server/middleware/uploadMiddleware.js)
- Multer configuration for file size (100MB limit) and MIME type validation.

#### [NEW] [server/middleware/rateLimiter.js](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/server/middleware/rateLimiter.js)
- Rate limiting middleware using `express-rate-limit` for upload and verification routes.

#### [NEW] [server/controllers/fileController.js](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/server/controllers/fileController.js)
- API endpoint logic:
  - `uploadFile`: Encrypt file, hash optional password with bcrypt, save metadata, return share URL.
  - `getFileInfo`: Returns public metadata (name, size, remaining downloads, expiration, password protected flag).
  - `verifyPassword`: Verifies bcrypt password for protected file links.
  - `downloadFile`: Decrypts stored file and streams file to client, increments download count, deletes file if limit reached.
  - `deleteFile`: Manual/internal removal of file by token.

#### [NEW] [server/routes/fileRoutes.js](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/server/routes/fileRoutes.js)
- Route handlers for `/api/files/upload`, `/api/files/info/:token`, `/api/files/verify`, `/api/files/:token`, `/api/files/delete/:token`.

#### [NEW] [server/app.js](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/server/app.js)
- Express application instance, CORS, Helmet security headers, JSON body parsing, rate limiters, routes.

#### [NEW] [server/server.js](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/server/server.js)
- Entry point starting server and background cleanup cron tasks.

---

### Frontend (`client/`)

#### [NEW] [client/package.json](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/client/package.json)
- React, React Router DOM, Axios, Lucide React, Tailwind CSS, PostCSS, Autoprefixer, react-dropzone, react-hot-toast, qrcode.react.

#### [NEW] [client/vite.config.js](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/client/vite.config.js)
- Vite configuration with API proxy setting `/api` -> `http://localhost:5000`.

#### [NEW] [client/tailwind.config.js](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/client/tailwind.config.js) & [client/src/index.css](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/client/src/index.css)
- Design tokens, custom dark theme colors, vibrant gradients, glassmorphism utilities, micro-animation styling.

#### [NEW] [client/src/services/api.js](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/client/src/services/api.js)
- Axios API instance with file upload tracking helper (`onUploadProgress`).

#### [NEW] [client/src/components/Navbar.jsx](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/client/src/components/Navbar.jsx) & [client/src/components/Footer.jsx](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/client/src/components/Footer.jsx)
- Sleek modern navigation bar with logo, status indicator, GitHub links, and structured footer.

#### [NEW] [client/src/components/UploadCard.jsx](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/client/src/components/UploadCard.jsx)
- Drag-and-drop zone using `react-dropzone`, file size & configuration inputs (expiration hours, download limits, optional password).

#### [NEW] [client/src/components/ProgressBar.jsx](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/client/src/components/ProgressBar.jsx)
- Smooth percentage progress indicator with upload speed and status details.

#### [NEW] [client/src/components/QRCodeCard.jsx](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/client/src/components/QRCodeCard.jsx)
- Interactive QR code display with download/copy link features.

#### [NEW] [client/src/components/PasswordModal.jsx](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/client/src/components/PasswordModal.jsx)
- Password entry modal for protected downloads.

#### [NEW] [client/src/components/FilePreview.jsx](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/client/src/components/FilePreview.jsx)
- Visual preview component for images, media, text, or file icon badges.

#### [NEW] [client/src/pages/Home.jsx](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/client/src/pages/Home.jsx)
- Landing page with animated hero section, feature cards, quick stats, and primary CTA.

#### [NEW] [client/src/pages/Upload.jsx](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/client/src/pages/Upload.jsx)
- Upload page combining `UploadCard`, options configuration, upload state, generated link view, and QR code modal.

#### [NEW] [client/src/pages/Download.jsx](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/client/src/pages/Download.jsx)
- Secure download page fetching metadata, password prompt, remaining downloads display, file preview, and decrypt/download trigger.

#### [NEW] [client/src/pages/Error.jsx](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/client/src/pages/Error.jsx)
- Responsive error page handling 404, expired links, and download limits reached.

#### [NEW] [client/src/App.jsx](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/client/src/App.jsx) & [client/src/main.jsx](file:///d:/DEMO%20PROJECT/pp4m/file%20secure%20share/File-sharing-/client/src/main.jsx)
- Router setup (`BrowserRouter`, routes for `/`, `/upload`, `/download/:token`, `*`), `Toaster` configuration.

---

## Verification Plan

### Automated Tests & Server Validation
- Run `npm run dev` to launch client and backend concurrently.
- Verify Express backend startup and MongoDB connection initialization.

### Manual Verification
1. **File Upload Test**: Upload an image/document file with/without password protection, setting expiration time and download limit.
2. **Encryption Check**: Inspect `server/uploads/` to confirm that files saved on disk are encrypted binary files and cannot be read as plaintext.
3. **Sharing & Download Test**: Open generated download link in browser. Verify metadata, test password prompt if protected, and trigger download. Verify decrypted downloaded file integrity.
4. **Limits & Expiry Test**: Exceed download limit or trigger expired token request to verify red screen Error Page response.
5. **QR Code & Copy**: Test copy link button and QR code display.
