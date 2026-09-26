const API_URL = import.meta.env.VITE_API_URL;

export async function uploadFile(file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    xhr.open("POST", `${API_URL}/api/files`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent, event.loaded, event.total);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new Error("Failed to parse response JSON"));
        }
        return;
      }

      reject(new Error("Upload failed"));
    };

    xhr.onerror = () => {
      reject(new Error("Network error"));
    };

    formData.append("file", file);
    xhr.send(formData);
  });
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
    throw new Error("Failed to create text");
  }

  return response.json();
}

export async function getText(id) {
  const response = await fetch(`${API_URL}/api/text/${id}`);

  if (!response.ok) {
    throw new Error("failed to get text");
  }

  return response.json();
}

export async function getTransfer(code) {
  const response = await fetch(`${API_URL}/api/transfers/${code}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("Transfer not found or expired");
  }

  return response.json();
}
