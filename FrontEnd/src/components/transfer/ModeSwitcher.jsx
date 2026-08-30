import { File, Type } from "lucide-react";

function ModeSwitcher({ mode, onModeChange }) {
  return (
    <div className="mode-switcher">
      <button
        className={`mode-btn ${
          mode === "file" ? "active" : ""
        }`}
        onClick={() => onModeChange("file")}
      >
        <File size={15} />

        File
      </button>

      <button
        className={`mode-btn ${
          mode === "text" ? "active" : ""
        }`}
        onClick={() => onModeChange("text")}
      >
        <Type size={15} />

        Text
      </button>
    </div>
  );
}

export default ModeSwitcher;