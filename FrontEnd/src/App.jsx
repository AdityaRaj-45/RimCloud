import { useEffect, useState } from "react";
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
  getText,
  sendFileEmail,
  sendTextEmail,
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

  const [emailLoading, setEmailLoading] = useState(false);

  const [retrievedText, setRetrievedText] = useState("");
  useEffect(() => {
  function handleCopyCut(event) {
    const target = event.target;

    // Allow copy/cut only inside the main text editor textarea
    if (
      target instanceof HTMLTextAreaElement &&
      target.closest(".text-editor")
    ) {
      return;
    }

    event.preventDefault();
  }

  function handleContextMenu(event) {
    const target = event.target;

    // Allow right-click only inside the text editor
    if (
      target instanceof HTMLTextAreaElement &&
      target.closest(".text-editor")
    ) {
      return;
    }

    event.preventDefault();
  }

  function handleKeyboard(event) {
    const target = event.target;

    // Allow shortcuts inside the text editor
    if (
      target instanceof HTMLTextAreaElement &&
      target.closest(".text-editor")
    ) {
      return;
    }

    const key = event.key.toLowerCase();

    const copyOrCut =
      (event.ctrlKey || event.metaKey) &&
      (key === "c" || key === "x");

    if (copyOrCut) {
      event.preventDefault();
    }
  }

  document.addEventListener(
    "copy",
    handleCopyCut
  );

  document.addEventListener(
    "cut",
    handleCopyCut
  );

  document.addEventListener(
    "contextmenu",
    handleContextMenu
  );

  document.addEventListener(
    "keydown",
    handleKeyboard
  );

  return () => {
    document.removeEventListener(
      "copy",
      handleCopyCut
    );

    document.removeEventListener(
      "cut",
      handleCopyCut
    );

    document.removeEventListener(
      "contextmenu",
      handleContextMenu
    );

    document.removeEventListener(
      "keydown",
      handleKeyboard
    );
  };
}, []);
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
    setRetrievedText("");
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
        url: data.file,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
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
        url: `${import.meta.env.VITE_API_URL}/api/text/${data.code}`,
      });

      showToast("Access code generated");
    } catch (error) {
      console.error(error);

      showToast(
        "Couldn't generate access code",
        "error"
      );
    } finally {
      setTextLoading(false);
    }
  }

  async function handleRetrieveText(code) {
    if (!code.trim()) {
      showToast("Enter an access code", "error");
      return;
    }

    try {
      const data = await getText(code.trim());

      setRetrievedText(data.text);
      setText(data.text);

      showToast("Text retrieved");
    } catch (error) {
      showToast(
        "That code doesn't exist or has expired.",
        "error"
      );
    }
  }

  async function handleSendEmail({
    from,
    to,
  }) {
    if (!shareData) {
      showToast("Create a transfer first", "error");
      return;
    }

    setEmailLoading(true);

    try {
      if (shareData.type === "file") {
        const uuid = shareData.url.split("/").pop();

        await sendFileEmail({
          uuid,
          emailTo: to,
          emailFrom: from,
        });
      } else {
        await sendTextEmail({
          code: shareData.code,
          emailTo: to,
          emailFrom: from,
        });
      }

      showToast("Transfer sent successfully");
    } catch (error) {
      console.error(error);

      showToast(
        "Couldn't send the email",
        "error"
      );
    } finally {
      setEmailLoading(false);
    }
  }

  function handleReset() {
    setSelectedFile(null);
    setShareData(null);
    setUploadProgress(0);
    setText("");
    setRetrievedText("");
  }

  return (
    <div className="app-shell">
      <Sidebar
        mode={mode}
        onModeChange={handleModeChange}
      />

      <main className="main-content">
        <Header />

        <section className="workspace-card">
          <ModeSwitcher
            mode={mode}
            onModeChange={handleModeChange}
          />

          {mode === "file" && (
            <>
              {!uploading && !shareData && (
                <FileDropzone
                  selectedFile={selectedFile}
                  onFileSelected={handleFileSelected}
                  onUpload={handleUpload}
                  onRemove={() => setSelectedFile(null)}
                />
              )}

              {uploading && (
                <UploadProgress
                  progress={uploadProgress}
                  file={selectedFile}
                />
              )}
            </>
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
              onRetrieve={handleRetrieveText}
              loading={false}
            />
          )}
          {shareData && (
            <ShareResult
              data={shareData}
              onSendEmail={handleSendEmail}
              emailLoading={emailLoading}
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