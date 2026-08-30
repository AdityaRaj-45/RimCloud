import { useState } from "react";

import {
  Send,
  LoaderCircle,
} from "lucide-react";

function EmailForm({
  onSubmit,
  loading,
}) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      from,
      to,
    });
  }

  return (
    <form
      className="email-form"
      onSubmit={handleSubmit}
    >
      <div className="field">
        <label htmlFor="sender">
          FROM
        </label>

        <input
          id="sender"
          type="email"
          required
          value={from}
          onChange={(event) =>
            setFrom(event.target.value)
          }
          placeholder="you@example.com"
        />
      </div>

      <div className="field">
        <label htmlFor="receiver">
          TO
        </label>

        <input
          id="receiver"
          type="email"
          required
          value={to}
          onChange={(event) =>
            setTo(event.target.value)
          }
          placeholder="them@example.com"
        />
      </div>

      <button
        className="primary-btn send-btn"
        disabled={loading}
        type="submit"
      >
        {loading ? (
          <>
            <LoaderCircle
              size={16}
              className="spin"
            />

            Sending...
          </>
        ) : (
          <>
            <Send size={16} />

            Send transfer
          </>
        )}
      </button>
    </form>
  );
}

export default EmailForm;