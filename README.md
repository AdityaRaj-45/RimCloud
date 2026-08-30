```text
# RimCloud

> **Move anything. Anywhere.**  
> A lightweight, self-hosted file and text transfer platform built for seamless cross-device sharing.


## ⚡ Overview

**RimCloud** is a personal transfer service engineered to eliminate friction when moving files, code snippets, links, and text between different machines and environments.

Instead of routing sensitive data through third-party cloud drives, RimCloud allows you to host your own instance. Simply drop a file or paste text, generate a short access code, and pull your data down instantly from any target device.

```text
[ Device A ] ──( Upload File / Text )──► [ RimCloud Server ]
                                                │
                                       ( Generates Code )
                                                ▼
[ Device B ] ◄──( Retrieve Content )──── [ Access Code ]



---

## 🎯 Key Features

### 📁 File Transfers

* Drag-and-drop workspace with instantaneous local file previews.
* Support for rapid single-file uploads with real-time progress indicators.
* Client-side validation for file size limits and payload safety.

### 📝 Text & Snippet Sharing

* Dedicated text workspace optimized for copying commands, API keys, links, code blocks, and markdown notes.
* High-contrast copy controls and quick-clear actions.
* Real-time character counter and status trackers.

### 🔑 Secure Retrieval

* Short, human-readable access codes for fast manual entry.
* Automatic QR code generation for instant retrieval via mobile devices.
* Direct download and one-click clipboard copying on target devices.

---

## 🛠 Tech Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React 19, Vite, Vanilla CSS (Modern Dark Charcoal / Crimson Theme) |
| **Backend** *(Planned)* | Node.js, Express.js, REST API |
| **Database** *(Planned)* | MongoDB / Mongoose |
| **Storage & Security** *(Planned)* | Local File Storage, Rate Limiting, Automated TTL Expiration |

---

## 🚦 Roadmap & Project Status

RimCloud is actively being developed in modular phases.

* [x] **Phase 1: Frontend Interface & Client-Side Experience**
* [x] Modern responsive UI (Desktop, Tablet, Mobile)
* [x] Workspace mode switcher (File Dropzone vs. Text Editor)
* [x] Toast notification and upload progress state systems
* [x] Accessibility-tuned high-contrast controls
* [x] QR code display and transfer result modules


* [ ] **Phase 2: Core Backend Engine**
* [ ] Express REST API setup
* [ ] Multi-part file upload processing & validation middleware
* [ ] Secure access-code generation algorithms
* [ ] Ephemeral text storage service


* [ ] **Phase 3: Lifecycle & Security**
* [ ] Automated TTL cleanup & transfer expiration routines
* [ ] Rate limiting & abuse protection
* [ ] Email dispatch service integration


* [ ] **Phase 4: Deployment & DevOps**
* [ ] Docker & `docker-compose` self-hosting configurations
* [ ] Environment variable templating & production builds



---

## 🚀 Getting Started (Frontend)

### Prerequisites

* [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
* `npm` or `yarn`

### Installation & Local Setup

1. **Clone the repository:**
```bash
git clone [https://github.com/your-username/rimcloud.git](https://github.com/your-username/rimcloud.git)
cd rimcloud/FrontEnd

```


2. **Install dependencies:**
```bash
npm install

```


3. **Configure environment variables:**
```bash
cp .env.example .env

```


*(Update `VITE_API_URL` with your local backend port or test endpoint).*
4. **Start the development server:**
```bash
npm run dev

```


5. Open your browser and navigate to `http://localhost:5173`.

---

## 📄 License

This project is open source and available under the [MIT License](https://www.google.com/search?q=LICENSE).

```

```
