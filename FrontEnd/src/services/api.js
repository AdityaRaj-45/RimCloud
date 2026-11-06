const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB client-side ceiling

export async function uploadFiles(files, onProgress) {
  if (!files || files.length === 0) {
    throw new Error("No files selected for upload.");
  }

  // Quick client-side check to stop oversized uploads before network requests
  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`"${file.name}" exceeds the 100 MB size limit.`);
    }
  }

  // 1. Ask backend for S3 presigned PUT URLs
  const presignResponse = await fetch(`${API_URL}/api/files/presign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      files: files.map((file) => ({
        name: file.name,
        size: file.size,
        mimeType: file.type || "application/octet-stream",
      })),
    }),
  });

  if (!presignResponse.ok) {
    let errorMessage = "Could not prepare file upload";
    try {
      const err = await presignResponse.json();
      errorMessage = err.error || err.message || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  const { code, uploads } = await presignResponse.json();

  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  let uploadedBytes = 0;

  if (onProgress) {
    onProgress(0, 0, totalBytes);
  }

  // 2. Stream files directly to AWS S3
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const upload = uploads[i];

    await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", upload.uploadUrl);

      // Must match the MIME type specified during presign creation
      xhr.setRequestHeader("Content-Type", upload.mimeType);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const currentLoaded = uploadedBytes + event.loaded;
          const percent = totalBytes > 0 ? Math.round((currentLoaded / totalBytes) * 100) : 100;
          onProgress(percent, currentLoaded, totalBytes);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          uploadedBytes += file.size;
          if (onProgress) {
            const percent = totalBytes > 0 ? Math.round((uploadedBytes / totalBytes) * 100) : 100;
            onProgress(percent, uploadedBytes, totalBytes);
          }
          resolve();
        } else {
          reject(new Error(`Failed to upload "${file.name}" directly to storage (Status ${xhr.status})`));
        }
      };

      xhr.onerror = () => {
        reject(new Error(`Network error while uploading "${file.name}"`));
      };

      xhr.onabort = () => {
        reject(new Error(`Upload cancelled for "${file.name}"`));
      };

      xhr.send(file);
    });
  }

  // 3. Notify backend that direct S3 uploads completed
  const completeResponse = await fetch(
    `${API_URL}/api/files/${encodeURIComponent(code)}/complete`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }
  );

  if (!completeResponse.ok) {
    let errorMessage = "Could not finalize transfer";
    try {
      const err = await completeResponse.json();
      errorMessage = err.error || err.message || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  // Returns { code, qrCode, file, url, expiresAt, files }
  return completeResponse.json();
}

export async function createText(text) {
  const response = await fetch(`${API_URL}/api/text`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    let errorMessage = "Failed to create text";
    try {
      const err = await response.json();
      errorMessage = err.error || err.message || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function getTransfer(code) {
  const response = await fetch(`${API_URL}/api/transfers/${code}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    let errorMessage = "Transfer not found or expired";
    try {
      const err = await response.json();
      errorMessage = err.error || err.message || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  return response.json();
}