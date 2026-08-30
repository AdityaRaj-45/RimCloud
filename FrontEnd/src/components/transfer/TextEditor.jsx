import {
  Zap,
  CircleCheck,
  Copy,
  Trash2,
} from "lucide-react";

function TextEditor({
  value,
  onChange,
  onGenerate,
  loading,
}) {
  async function copyText() {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  }

  function clearText() {
    onChange("");
  }

  return (
    <div className="text-editor">
      <div className="editor-head">
        <div>
          <small>QUICK NOTE</small>

          <strong>
            Paste anything worth moving.
          </strong>
        </div>

        <span className="char-count">
          {value.length} / 5000
        </span>
      </div>

      <textarea
        value={value}
        maxLength={5000}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder="Paste code, a link, a note, a command…"
      />

      <div className="editor-foot">
        <span className="editor-status">
          <CircleCheck size={14} />
          Nothing is saved locally
        </span>

        <div className="editor-actions">
          <button
            className="editor-action-btn"
            type="button"
            onClick={copyText}
            disabled={!value}
            title="Copy text"
          >
            <Copy size={14} />
            Copy
          </button>

          <button
            className="editor-action-btn danger"
            type="button"
            onClick={clearText}
            disabled={!value}
            title="Clear text"
          >
            <Trash2 size={14} />
            Clear
          </button>

          <button
            className="primary-btn"
            type="button"
            onClick={onGenerate}
            disabled={loading || !value.trim()}
          >
            <Zap size={16} />

            {loading
              ? "Generating..."
              : "Generate access code"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TextEditor;