import { ShieldCheck } from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <img
          src="/favicon.svg"
          alt="RimCloud"
          className="brand-logo"
        />

        <span>rimcloud</span>
      </div>

      <div className="sidebar-spacer" />

      <div className="privacy-card">
        <ShieldCheck size={18} />

        <div>
          <strong>Private by default</strong>

          <small>
            Links expire after 1 hour
          </small>
        </div>
      </div>

      <div className="sidebar-footer">
        <span>RimCloud</span>

        <span>v1.0</span>
      </div>
    </aside>
  );
}

export default Sidebar;