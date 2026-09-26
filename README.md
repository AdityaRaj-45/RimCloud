# RimCloud

RimCloud is a temporary file and text sharing app.

Current setup:

- React and Vite frontend
- Express and Mongoose backend
- MongoDB Atlas for transfer metadata and text
- Temporary local disk storage for files
- One-hour transfer expiry and cleanup
- QR codes and access codes for files and text
- Image/video previews; other files show filename and download action
- Email sharing disabled

## Layout

```text
FrontEnd/       React/Vite app
backend-local/  MongoDB Atlas + local storage backend for testing
backend/        MongoDB Atlas + Cloudflare R2 backend for later use
```

Use only `backend-local/` for the current local file-transfer workflow.

## MongoDB Atlas

1. Create an Atlas cluster and database user.
2. Give the user read/write access.
3. In **Network Access**, add your current IP address.
4. Copy the Node.js driver connection string.
5. Replace `<db_password>` with the real password and URL-encode special characters such as `#` as `%23`.

Example:

```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/rimcloud?retryWrites=true&w=majority
```

## Run Locally

Configure `backend-local/.env`:

```bash
cd backend-local
cp .env.example .env
```

Set `MONGO_URI`. The important values are:

```env
PORT=5000
TRANSFER_TTL_HOURS=1
MAX_FILE_SIZE_MB=100
STORAGE_DIR=./storage
```

Start the backend:

```bash
cd backend-local
npm install
npm run dev
```

Expected output:

```text
MongoDB Atlas connected
Local backend listening on port 5000
```

Configure `FrontEnd/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend in a second terminal:

```bash
cd FrontEnd
npm install
npm run dev
```

Open `http://localhost:5173`.

Test the backend:

```bash
curl http://localhost:5000/health
```

New transfers expire after one hour. Cleanup runs every minute while the backend is running, deletes files from `backend-local/storage/`, and deletes their MongoDB Atlas records.

## Checks

```bash
cd FrontEnd
npm run build
npm run lint
```

## GitHub Upload

Create an empty GitHub repository, then from the project root:

```bash
git add .gitignore README.md FrontEnd backend-local
git status
git commit -m "Add local file transfer backend and frontend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Do not commit `.env`, `node_modules`, `dist`, or `storage` files. They are ignored by the repository rules.

If the GitHub branch already contains commits:

```bash
git stash push -u -m "backup before syncing"
git pull --rebase origin main
git stash pop
git add .gitignore README.md FrontEnd backend-local
git commit -m "Add local file transfer backend and frontend"
git push -u origin main
```

Resolve README conflicts by keeping this current README, then run `git add README.md` and `git rebase --continue`.

## Hosting

Deploy the frontend to Vercel:

1. Import the GitHub repository.
2. Set root directory to `FrontEnd`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add `VITE_API_URL` with the public backend URL.

Do not use Vercel for durable `backend-local/storage` files. Serverless filesystems are temporary.

For a demo, run `backend-local` on your own machine and expose port 5000 with a tunnel. For a real deployment, use a persistent backend host such as Render, Railway, Fly.io, or a VPS, and move file storage to Cloudflare R2. The existing `backend/` directory is the later R2 version.

## Security

Never publish MongoDB passwords, API keys, `.env` files, or uploaded files. If a database password is exposed, rotate it in MongoDB Atlas immediately.
