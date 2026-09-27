import { LockKeyhole } from "lucide-react";

function Header() {
  return (
    <header className="topbar">
      <div>
        <div className="eyebrow">
          PERSONAL TRANSFER SPACE
        </div>

        <h1>
          Move anything.{" "}
          <em>Anywhere.</em>
        </h1>

        <p className="header-description">
          Private file and text transfers.
        </p>
      </div>

      <div className="secure-pill">
        <LockKeyhole size={14} />

        Secure transfer
      </div>
    </header>
  );
}

export default Header;