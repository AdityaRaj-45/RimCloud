import { useState } from "react";

import {
  Check,
  Copy,
  Download,
  QrCode,
  RotateCcw,
  Link,
} from "lucide-react";

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function ShareResult({
  data,
  onReset,
}) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(data.url);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      console.error("Couldn't copy");
    }
  }

  async function copyCode() {
    await navigator.clipboard.writeText(data.code);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1800);
  }

  return (
    <section className="result-card">
      <div className="result-head">
        <div>
          <small>READY TO SHARE</small>

          <h2>
            Your handoff is ready.
          </h2>
        </div>

        <span className="live-badge">
          <span />
          Live
        </span>
      </div>

      {data.type === "file" && (
        <div className="file-result">
          <div className="files-summary">
            <strong>
              {data.files?.length || 0} file{data.files?.length !== 1 ? "s" : ""} ready
            </strong>
            <span>Ready for sharing</span>
          </div>

          <div className="result-files">
            {data.files?.map((file) => (
              <div className="result-file" key={file.id}>
                <div className="result-file-icon">
                  <Link size={20} />
                </div>

                <div>
                  <strong>{file.name}</strong>
                  <span>{formatSize(file.size)}</span>
                </div>

                <a
                  className="file-download-btn"
                  href={file.downloadUrl}
                >
                  <Download size={14} />
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="link-section">
        <div className="share-label">
          <b>
            {data.type === "text"
              ? "TEXT LINK"
              : "TRANSFER LINK"}
          </b>

          <span>
            Expires in 1 hour
          </span>
        </div>

        <div className="link-field">
          <input
            value={data.url}
            readOnly
          />

          <button
            className="copy-btn"
            onClick={copyLink}
            type="button"
          >
            {copied ? (
              <Check size={17} />
            ) : (
              <Copy size={17} />
            )}
          </button>
        </div>
      </div>

      {(data.type === "text" || data.type === "file") && (
        <div className="text-share-result">
          <div className="qr-card">
            <div className="qr-title">
              <QrCode size={14} />

              SCAN TO OPEN
            </div>

            <div className="qr-code">
              {data.qrCode ? (
                <img
                  src={data.qrCode}
                  alt="QR code"
                />
              ) : (
                <div className="qr-placeholder">
                  QR
                </div>
              )}
            </div>
          </div>

          <div className="code-card">
            <small>ACCESS CODE</small>

            <strong>{data.code}</strong>

            <button
              className="ghost-btn"
              onClick={copyCode}
            >
              <Copy size={14} />

              {copied
                ? "Copied"
                : "Copy code"}
            </button>
          </div>
        </div>
      )}

      <button
        className="new-transfer"
        onClick={onReset}
        type="button"
      >
        <RotateCcw size={14} />

        Start another transfer
      </button>
    </section>
  );
}

export default ShareResult;