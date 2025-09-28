import { useState, useRef, type FC, type DragEvent } from "react";
import { cn } from "../utils";

type UploadProps = {
  onUpload: (file: File) => void;
};

const Upload: FC<UploadProps> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    if (file) {
      onUpload(file);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="upload-container">
      <div
        className={cn(
          "drag-drop-area bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-8 cursor-pointer hover:bg-blue-100 transition-colors",
          isDragOver && "drag-over"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="drag-drop-content">
          <p className="drag-text text-gray-700 font-medium">
            {isDragOver
              ? "Drop your file here"
              : "Drag and drop a file here, or click to select"}
          </p>
          {file && (
            <p className="selected-file text-green-600 font-semibold mt-2">
              Selected: {file.name}
            </p>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileInputChange}
        accept="application/json"
        style={{ display: "none" }}
      />

      {file && (
        <button
          className="font-semibold py-3 px-6 rounded-lg transition-colors"
          onClick={handleUpload}
        >
          Upload {file.name}
        </button>
      )}
    </div>
  );
};

export default Upload;
