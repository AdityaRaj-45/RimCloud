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
  selectedFiles,
  onFilesSelected,
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

    const files = Array.from(event.dataTransfer.files || []);

    if (files.length) {
      onFilesSelected(files);
    }
  }

  function handleInput(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (files.length) {
      onFilesSelected(files);
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
      {selectedFiles.length === 0 ? (
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
            multiple
            hidden
            onChange={handleInput}
          />

          <div className="drop-icon">
            <UploadCloud size={30} />
          </div>

          <div className="drop-copy">
            <h2>
              {dragging
                ? "Drop files here"
                : "Drop your files here"}
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
              Up to 100 files · 100 MB each
            </span>
          </div>
        </div>
      ) : (
        <div className="selected-files">
          <div className="selected-files-header">
            <div>
              <strong>
                {selectedFiles.length} file{selectedFiles.length !== 1 ? "s" : ""} selected
              </strong>
              <span>Maximum 100 files · 100 MB each</span>
            </div>

            <button
              className="remove-file"
              onClick={onRemove}
              type="button"
              aria-label="Remove all files"
            >
              <X size={17} />
            </button>
          </div>

          <div className="selected-files-list">
            {selectedFiles.map((file, index) => (
              <div
                className="selected-file"
                key={`${file.name}-${file.lastModified}-${index}`}
              >
                <div className="file-icon">
                  <File size={20} />
                </div>

                <div className="file-info">
                  <strong>{file.name}</strong>
                  <span>{formatSize(file.size)}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            className="upload-btn"
            onClick={onUpload}
            type="button"
          >
            <Upload size={17} />
            Upload {selectedFiles.length} file{selectedFiles.length !== 1 ? "s" : ""}
          </button>
        </div>
      )}
    </div>
  );
}

export default FileDropzone;