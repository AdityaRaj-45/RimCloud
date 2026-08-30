import {
  UploadCloud,
  LoaderCircle,
} from "lucide-react";

function UploadProgress({ progress, file }) {
  return (
    <div className="upload-progress">
      <div className="progress-header">
        <div className="progress-title">
          <div className="progress-icon">
            <UploadCloud size={19} />
          </div>

          <div>
            <small>TRANSFERRING</small>

            <strong>
              {file?.name || "Uploading file…"}
            </strong>
          </div>
        </div>

        <div className="progress-number">
          {progress}%
        </div>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <div className="progress-footer">
        <span>
          <LoaderCircle
            size={13}
            className="spin"
          />

          Uploading securely
        </span>

        <span>
          {progress === 100
            ? "Finishing…"
            : "Please keep this window open"}
        </span>
      </div>
    </div>
  );
}

export default UploadProgress;