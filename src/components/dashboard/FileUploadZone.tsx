import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloudArrowUpIcon,
  DocumentIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { getBackendUrl } from "@/utils/backend";

interface FileUploadZoneProps {
  onFileUpload?: (files: File[]) => void;
  onUploadComplete?: () => void;
  acceptedFormats?: string[];
  maxSize?: number;
  className?: string;
}

interface UploadedFile {
  file: File;
  id: string;
  status: "uploading" | "success" | "error";
  progress: number;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileUpload,
  onUploadComplete,
  acceptedFormats = [".pdf", ".csv", ".xlsx", ".json"],
  maxSize = 10 * 1024 * 1024, // 10MB
  className = "",
}) => {
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [assignedDoctor, setAssignedDoctor] = useState("");
  const doctorOptions = [
    { value: "dr_ahmed", label: "Dr. Ahmed" },
    { value: "dr_sara", label: "Dr. Sara" },
    { value: "dr_john", label: "Dr. John" },
  ];
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const uploadToBackend = async (file: File, patientId: string, assignedDoctorId: string) => {
    const backendUrl = getBackendUrl();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("patient_id", patientId);
    formData.append("assigned_doctor_id", "3");

    try {
      const response = await fetch(`${backendUrl}/upload-pdf/`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      return true;
    } catch (error) {
      return false;
    }
  };
  useEffect(() => {
    if (
      uploadedFiles.length > 0 &&
      uploadedFiles.every(f => f.status !== "uploading")
    ) {
      onUploadComplete?.();
      setShowPatientModal(true);
      setUploadedFiles([]);
    }
  }, [uploadedFiles, onUploadComplete]);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setPendingFiles(acceptedFiles);
      setShowPatientModal(true);
    },
    []
  );

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
        "text/csv": [".csv"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
          ".xlsx",
        ],
        "application/json": [".json"],
      },
      maxSize,
      onDragEnter: () => setIsDragActive(true),
      onDragLeave: () => setIsDragActive(false),
    });

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "uploading":
        return "medical-blue";
      case "success":
        return "medical-green";
      case "error":
        return "medical-red";
      default:
        return "medical-blue";
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "📄";
      case "csv":
      case "xlsx":
        return "📊";
      case "json":
        return "🔧";
      default:
        return "📁";
    }
  };
  const rootProps = getRootProps({ refKey: "ref" });
  return (
    <div className={`w-full ${className}`}>
      {/* Drop Zone */}
      {showPatientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background rounded-xl shadow-xl p-8 w-full max-w-md glass-card border border-medical-glass-border"
          >
            <h3 className="text-xl font-bold mb-4 text-medical-blue">Patient Details</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-medical-blue">Patient ID</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-medical-blue"
                value={patientId}
                onChange={e => setPatientId(e.target.value)}
                placeholder="Enter Patient ID"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1 text-medical-blue">Assigned Doctor</label>
              <select
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-medical-blue"
                value={assignedDoctor}
                onChange={e => setAssignedDoctor(e.target.value)}
              >
                <option value="">Select Doctor</option>
                {doctorOptions.map(doc => (
                  <option key={doc.value} value={doc.value}>{doc.label}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-lg bg-medical-blue text-white font-semibold hover:bg-medical-blue/90"
                onClick={async () => {
                  // Optionally validate patientId and assignedDoctor here
                  setShowPatientModal(false);

                  // Now upload the files
                  const newFiles: UploadedFile[] = pendingFiles.map((file) => ({
                    file,
                    id: Math.random().toString(36).substr(2, 9),
                    status: "uploading",
                    progress: 0,
                  }));

                  setUploadedFiles((prev) => [...prev, ...newFiles]);
                  for (const uploadFile of newFiles) {
                    const success = await uploadToBackend(uploadFile.file, patientId, assignedDoctor);
                    setUploadedFiles((prev) =>
                      prev.map((f) =>
                        f.id === uploadFile.id
                          ? {
                            ...f,
                            status: success ? "success" : "error",
                            progress: 100,
                          }
                          : f
                      )
                    );
                  }
                  setPendingFiles([]);
                }}
              >
                Save
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
                onClick={() => {
                  setShowPatientModal(false);
                  setPendingFiles([]);
                }}              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <motion.div
        {...rootProps}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 cursor-pointer
          ${isDragAccept ? "border-medical-green bg-medical-green/10" : ""}
          ${isDragReject ? "border-medical-red bg-medical-red/10" : ""}
          ${isDragActive ? "border-medical-blue bg-medical-blue/10" : "border-medical-glass-border"}
          glass-card hover:bg-medical-glass/50
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input {...getInputProps()} />

        {/* Background Animation */}
        <AnimatePresence>
          {isDragActive && (
            <motion.div
              className="absolute inset-0 rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                background: [
                  "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
                  "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 70%)",
                  "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>

        <div className="relative z-10 text-center">
          {/* Upload Icon */}
          <motion.div
            className="mx-auto mb-4"
            animate={
              isDragActive
                ? {
                  y: [-5, 5, -5],
                  rotate: [0, 5, -5, 0],
                }
                : {}
            }
            transition={{ duration: 2, repeat: Infinity }}
          >
            <CloudArrowUpIcon
              className={`w-16 h-16 mx-auto ${isDragAccept
                ? "text-medical-green"
                : isDragReject
                  ? "text-medical-red"
                  : "text-medical-blue"
                } glow-blue`}
            />
          </motion.div>

          {/* Upload Text */}
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {isDragActive
              ? isDragAccept
                ? "Drop files here"
                : "Invalid file type"
              : "Upload Medical Data"}
          </h3>
          <p className="text-muted-foreground mb-4">
            Drag & drop files here, or click to browse
          </p>

          {/* Supported Formats */}
          <div className="flex justify-center gap-2 mb-4">
            {acceptedFormats.map((format) => (
              <span
                key={format}
                className="px-3 py-1 bg-medical-blue/20 text-medical-blue rounded-full text-xs font-medium"
              >
                {format}
              </span>
            ))}
          </div>

          {/* Max Size Info */}
          <p className="text-xs text-muted-foreground">
            Maximum file size: {Math.floor(maxSize / (1024 * 1024))}MB
          </p>
        </div>

        {/* Processing Particles */}
        {isDragActive && (
          <div className="absolute inset-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-medical-blue"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Uploaded Files List */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            className="mt-6 space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {uploadedFiles.map((uploadedFile) => (
              <motion.div
                key={uploadedFile.id}
                className="glass-card p-4 rounded-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {/* File Icon */}
                    <span className="text-2xl">
                      {getFileIcon(uploadedFile.file.name)}
                    </span>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {uploadedFile.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(uploadedFile.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>

                    {/* Status Icon */}
                    <div className="flex items-center gap-2">
                      {uploadedFile.status === "uploading" && (
                        <div className="w-4 h-4 border-2 border-medical-blue border-t-transparent rounded-full animate-spin" />
                      )}
                      {uploadedFile.status === "success" && (
                        <CheckCircleIcon className="w-5 h-5 text-medical-green" />
                      )}
                      {uploadedFile.status === "error" && (
                        <XMarkIcon className="w-5 h-5 text-medical-red" />
                      )}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFile(uploadedFile.id)}
                    className="ml-3 p-1 rounded-full hover:bg-medical-red/20 transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4 text-muted-foreground hover:text-medical-red" />
                  </button>
                </div>

                {/* Progress Bar */}
                {uploadedFile.status === "uploading" && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Uploading...</span>
                      <span>{uploadedFile.progress}%</span>
                    </div>
                    <div className="h-1 bg-background rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-${getStatusColor(uploadedFile.status)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadedFile.progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default FileUploadZone;
