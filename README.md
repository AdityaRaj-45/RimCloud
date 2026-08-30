# RimCloud

> **Move anything. Anywhere.**  
> A lightweight, self-hosted file and text transfer platform built for seamless cross-device sharing.

## ⚡ Overview

**RimCloud** is a personal transfer service designed to make it easy to move files, code snippets, links, and text between different devices.

Instead of relying on third-party cloud drives, RimCloud will allow you to host your own transfer service. Upload a file or paste text, generate an access code, and retrieve it from another device.

```text
[ Device A ] ──( Upload File / Text )──► [ RimCloud Server ]
                                                │
                                       ( Generates Code )
                                                ▼
[ Device B ] ◄──( Retrieve Content )──── [ Access Code ]
```

---

## 🎯 Key Features

### 📁 File Transfers

- Drag-and-drop file upload interface.
- Local file preview before uploading.
- Support for single-file transfers.
- File size validation.
- Upload progress indicators.

### 📝 Text & Snippet Sharing

- Dedicated text workspace.
- Share commands, links, code, notes, and other text.
- Copy and clear controls.
- Real-time character counter.
- Clipboard support.

### 🔑 Secure Retrieval

- Short access codes for retrieving transfers.
- QR code support for easier device-to-device retrieval.
- Direct file downloads.
- One-click text copying after retrieval.
- Temporary transfers with automatic expiration.

---

## 🛠 Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite, Vanilla CSS |
| Backend | Node.js, Express.js, REST API |
| Database | MongoDB / Mongoose |
| Storage | Local file storage |
| Security | Rate limiting, access codes, TTL expiration |
| Deployment | Docker, Docker Compose |

The backend, database, storage, and deployment systems are planned for upcoming development stages.

---

## 🚦 Roadmap & Project Status

RimCloud is being developed in multiple phases.

### Phase 1: Frontend

- [x] Modern dark-themed interface
- [x] Responsive layout
- [x] File and text workspace switcher
- [x] File dropzone
- [x] Text editor
- [x] Copy and clear controls
- [x] Character counter
- [x] Access code interface
- [x] QR code interface
- [x] Toast notifications
- [x] Transfer UI states

### Phase 2: Backend

- [ ] Node.js and Express server
- [ ] REST API
- [ ] File upload endpoint
- [ ] Text upload endpoint
- [ ] File retrieval endpoint
- [ ] Text retrieval endpoint
- [ ] Automatic access-code generation
- [ ] Transfer identification and management
- [ ] File size and payload validation

### Phase 3: Storage & Lifecycle

- [ ] MongoDB integration
- [ ] Temporary transfer storage
- [ ] Automatic transfer expiration
- [ ] TTL cleanup system
- [ ] File storage management
- [ ] Transfer status tracking

### Phase 4: Security

- [ ] Rate limiting
- [ ] Abuse protection
- [ ] Secure access-code generation
- [ ] Input validation
- [ ] Upload restrictions
- [ ] Secure file retrieval
- [ ] Environment-based configuration

### Phase 5: Deployment

- [ ] Docker configuration
- [ ] Docker Compose setup
- [ ] Production environment configuration
- [ ] Self-hosting documentation
- [ ] Deployment documentation

---

## 🔄 How RimCloud Will Work

The planned workflow is:

```text
Device A
   │
   │ Upload file / text
   ▼
RimCloud Backend
   │
   ├── Store content
   │
   ├── Generate access code
   │
   └── Set expiration time
   │
   ▼
Access Code
   │
   │ Enter code on Device B
   ▼
RimCloud Backend
   │
   ▼
Device B
   │
   └── Retrieve file / text
```

For example:

```text
Laptop
   │
   │ Upload just.zip
   ▼
RimCloud
   │
   │ Code: 5183
   ▼
Phone
   │
   │ Enter 5183
   ▼
Download just.zip
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm

### Frontend Setup

Clone the repository:

```bash
git clone https://github.com/AdityaRaj-45/RimCloud.git
cd RimCloud/FrontEnd
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

---

## 📂 Project Structure

```text
RimCloud/
│
├── Backend/
│   └── Backend code will be added here
│
├── FrontEnd/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🔐 Privacy & Expiration

RimCloud is intended to be a self-hosted transfer service.

The planned backend will use temporary transfers so that uploaded content does not remain available indefinitely.

Transfers will eventually support configurable expiration and automatic cleanup.

---

## 📌 Current Status

The frontend is currently the main completed part of the project.

The interface and client-side experience are being developed first. Backend development will be added in the next stage, connecting the existing frontend to the transfer server and storage system.

---

## 📄 License

This project is open source and available under the MIT License.
