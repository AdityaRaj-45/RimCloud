import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import ModeSwitcher from "./components/transfer/ModeSwitcher";
import FileDropzone from "./components/transfer/FileDropZone";
import TextEditor from "./components/transfer/TextEditor";
import RetrieveTransfer from "./components/transfer/RetrieveTransfer";
import UploadProgress from "./components/transfer/UploadProgress";
import ShareResult from "./components/transfer/ShareResult";
import Toast from "./components/ui/Toast";

import {
  uploadFile,
  createText,
  getTransfer,
} from "./services/api";

import "./App.css";
const MAX_FILE_SIZE = 100 * 1024 * 1024;

function App() {
  const [mode, setMode] = useState("file");
  const [selectedFile, setSelectedFile] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [shareData, setShareData] = useState(null);
  const [text, setText] = useState("");
  const [textLoading, setTextLoading] = useState(false);

  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({
      message,
      type,
    });

    setTimeout(() => {
      setToast(null);
    }, 2500);
  }

  function handleModeChange(newMode) {
    setMode(newMode);
    setShareData(null);
    setSelectedFile(null);
    setUploadProgress(0);
  }

  async function handleFileSelected(file) {
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      showToast(
        "File is too large. Maximum size is 100 MB.",
        "error"
      );
      return;
    }

    setSelectedFile(file);
    setShareData(null);

    showToast("File selected");
  }

  async function handleUpload() {
    if (!selectedFile) {
      showToast("Choose a file first", "error");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const data = await uploadFile(
        selectedFile,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      setShareData({
        type: "file",
        code: data.code,
        qrCode: data.qrCode,
        url: data.url,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        downloadUrl: data.files?.[0]?.downloadUrl,
      });

      showToast("Upload complete");
    } catch (error) {
      console.error(error);

      showToast(
        "Upload failed. Please try again.",
        "error"
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleGenerateText() {
    const trimmedText = text.trim();

    if (!trimmedText) {
      showToast("Enter some text first", "error");
      return;
    }

    setTextLoading(true);

    try {
      const data = await createText(trimmedText);
      setShareData({
        type: "text",
        code: data.code,
        qrCode: data.qrCode,
        url: data.url,
      });
      showToast("Access code generated");
    } catch (error) {
      console.error(error);
      showToast("Couldn't generate access code", "error");
    } finally {
      setTextLoading(false);
    }
  }

  async function handleRetrieveTransfer(code) {
    if (!code.trim()) {
      showToast("Enter an access code", "error");
      return;
    }

    try {
      const data = await getTransfer(code.trim());

      if (data.type === "text") {
        setMode("text");
        setText(data.text || "");
        showToast("Text retrieved");
      } else if (data.type === "file" && data.files?.[0]) {
        const file = data.files[0];
        setMode("file");
        setShareData({
          type: "file",
          code: data.code,
          url: `${import.meta.env.VITE_API_URL}/api/transfers/${data.code}`,
          fileName: file.name,
          fileSize: file.size,
          downloadUrl: file.downloadUrl,
        });
        showToast("File retrieved");
      } else {
        showToast("That transfer has no available content.", "error");
      }
    } catch {
      showToast(
        "That code doesn't exist or has expired.",
        "error"
      );
    }
  }

  function handleReset() {
    setSelectedFile(null);
    setShareData(null);
    setUploadProgress(0);
    setText("");
  }

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content">
        <Header />

        <section className="workspace-card">
          <ModeSwitcher
            mode={mode}
            onModeChange={handleModeChange}
          />

          {mode === "file" && !uploading && !shareData && (
            <FileDropzone
              selectedFile={selectedFile}
              onFileSelected={handleFileSelected}
              onUpload={handleUpload}
              onRemove={() => setSelectedFile(null)}
            />
          )}

          {mode === "file" && uploading && (
            <UploadProgress progress={uploadProgress} file={selectedFile} />
          )}

          {mode === "text" && !shareData && (
            <TextEditor
              value={text}
              onChange={setText}
              onGenerate={handleGenerateText}
              loading={textLoading}
            />
          )}
          {!shareData && (
            <RetrieveTransfer
              onRetrieve={handleRetrieveTransfer}
              loading={false}
              mode={mode}
            />
          )}
          {shareData && (
            <ShareResult
              data={shareData}
              onReset={handleReset}
            />
          )}
        </section>

        <footer className="page-footer">
          <span>Fast, simple sharing.</span>

          <span>
            <span className="footer-dot" />
            RimCloud
          </span>
        </footer>
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
        />
      )}
    </div>
  );
}

export default App;