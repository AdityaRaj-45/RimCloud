import {
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";

function Toast({ message, type }) {
  const Icon =
    type === "error"
      ? AlertCircle
      : type === "info"
      ? Info
      : CheckCircle2;

  return (
    <div className={`toast toast-${type}`}>
      <Icon size={17} />

      <span>{message}</span>
    </div>
  );
}

export default Toast;