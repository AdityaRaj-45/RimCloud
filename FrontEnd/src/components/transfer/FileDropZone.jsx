import { useRef, useState } from "react";

import {
  UploadCloud,
  File,
  X,
  ShieldCheck,
  Weight,
  Upload,
} from "lucide-react";

function FileDropzone({
  selectedFile,
  onFileSelected,
  onUpload,
  onRemove,
}) {
  const inputRef = useRef(null);

  const [dragging, setDragging] = useState(false);

  function openFilePicker() {
    inputRef.current?.click();
  }

  function handleDrop(event) {
    event.preventDefault();

    setDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      onFileSelected(file);
    }
  }

  function handleInput(event) {
    const file = event.target.files?.[0];

    if (file) {
      onFileSelected(file);
    }
  }

  function formatSize(bytes) {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  return (
    <div>
      {!selectedFile ? (
        <div
          className={`drop-zone ${
            dragging ? "dragged" : ""
          }`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={openFilePicker}
        >
          <input
            ref={inputRef}
            type="file"
            hidden
            onChange={handleInput}
          />

          <div className="drop-icon">
            <UploadCloud size={30} />
          </div>

          <div className="drop-copy">
            <h2>
              {dragging
                ? "Drop it here"
                : "Drop your file here"}
            </h2>

            <p>
              or{" "}
              <button
                type="button"
                className="browse-btn"
                onClick={(event) => {
                  event.stopPropagation();
                  openFilePicker();
                }}
              >
                browse from your device
              </button>
            </p>
          </div>

          <div className="drop-meta">
            <span>
              <ShieldCheck size={13} />
              Private transfer
            </span>

            <span>
              <Weight size={13} />
              Maximum 100 MB
            </span>
          </div>
        </div>
      ) : (
        <div className="selected-file">
          <div className="file-icon">
            <File size={24} />
          </div>

          <div className="file-info">
            <strong>{selectedFile.name}</strong>

            <span>
              {formatSize(selectedFile.size)}
            </span>
          </div>

          <button
            className="remove-file"
            onClick={onRemove}
            type="button"
          >
            <X size={17} />
          </button>

          <button
            className="upload-btn"
            onClick={onUpload}
            type="button"
          >
            <Upload size={17} />

            Upload file
          </button>
        </div>
      )}
    </div>
  );
}

export default FileDropzone;