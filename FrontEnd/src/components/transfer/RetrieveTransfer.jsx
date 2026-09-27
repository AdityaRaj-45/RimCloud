import { useState } from "react";
import { Search } from "lucide-react";

function RetrieveTransfer({
  onRetrieve,
  loading,
}) {
  const [code, setCode] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!code.trim()) return;

    onRetrieve(code.trim());
  }

  return (
    <div className="retrieve-box">
      <div className="retrieve-heading">
        <div>
          <small>ALREADY HAVE A CODE?</small>

          <strong>
            Retrieve a file
          </strong>
        </div>
      </div>

      <form
        className="retrieve-row"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          value={code}
          onChange={(event) =>
            setCode(event.target.value)
          }
          placeholder="Enter file access code"
          autoComplete="off"
        />

        <button
          className="dark-btn"
          type="submit"
          disabled={loading}
        >
          <Search size={15} />

          {loading
            ? "Retrieving..."
            : "Retrieve"}
        </button>
      </form>
    </div>
  );
}

export default RetrieveTransfer;