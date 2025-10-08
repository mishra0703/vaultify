"use client";

import { Copy, Clipboard, Edit2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const DataTable = ({
  passwordArray,
  setPasswordArray,
  formData,
  setFormData,
  fetchPasswords,
}) => {
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    itemId: null,
    itemUrl: "",
  });

  const [copiedStates, setCopiedStates] = useState({});

  const handleCopy = (text, itemId, field) => {
    const copyId = `${itemId}-${field}`;

    setCopiedStates((prev) => ({ ...prev, [copyId]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [copyId]: false }));
    }, 1000);
    navigator.clipboard.writeText(text);
  };

  const handleEdit = (id) => {
    const itemToEdit = passwordArray.find((i) => i._id === id);
    if (itemToEdit) {
      setFormData({
        _id: itemToEdit._id,
        url: itemToEdit.url,
        username: itemToEdit.username,
        password: itemToEdit.password,
        remarks: itemToEdit.remarks || "",
      });
    }
    setPasswordArray(passwordArray.filter((item) => item._id !== id));
  };

  const handleDelete = (id) => {
    const item = passwordArray.find((item) => item._id === id);
    setDeleteModal({ isOpen: true, itemId: id, itemUrl: item?.url || "" });
  };

  const confirmDelete = async () => {
    const id = deleteModal.itemId;

    try {
      const response = await fetch(`/api/passwords?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setPasswordArray(passwordArray.filter((item) => item._id !== id));
        setDeleteModal({ isOpen: false, itemId: null, itemUrl: "" });
      } else {
        console.error("Error deleting password:", result.message);
      }
    } catch (error) {
      console.error("Error deleting password:", error);
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, itemId: null, itemUrl: "" });
  };

  const getDisplayName = (url) => {
    const isDomain = url.includes(".") && !url.includes(" ");

    if (!isDomain) {
      return url.charAt(0).toUpperCase() + url.slice(1);
    }

    try {
      const fullUrl = url.startsWith("http") ? url : `https://${url}`;
      const hostname = new URL(fullUrl).hostname;
      const domain = hostname.replace(/^www\./, "");
      const siteName = domain.split(".")[0];
      return siteName.charAt(0).toUpperCase() + siteName.slice(1);
    } catch {
      return url;
    }
  };

  return (
    <div className="w-full flex justify-center mb-10 px-4">
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {passwordArray.map((item, index) => {
            const urlCopyId = `${index}-url`;
            const usernameCopyId = `${index}-username`;
            const passwordCopyId = `${index}-password`;

            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-gradient-to-br from-yellow-50 to-purple-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-yellow-200"
              >
                {/* Header Section */}
                <div className="bg-yellow-400 px-5 py-4 flex justify-between items-center">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-bold text-gray-900 hover:underline truncate"
                    >
                      {getDisplayName(item.url)}
                    </a>
                    <CopyButton
                      copyId={urlCopyId}
                      isCopied={copiedStates[urlCopyId]}
                      onCopy={() => handleCopy(item.url, index, "url")}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 ml-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(item._id)}
                      className="p-2 hover:bg-yellow-300 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} className="text-gray-900" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(item._id)}
                      className="p-2 hover:bg-red-200 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} className="text-red-600" />
                    </motion.button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 space-y-4">
                  {/* Username */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Username / ID
                    </label>
                    <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-yellow-200">
                      <span className="flex-1 text-sm font-medium text-gray-900 truncate">
                        {item.username}
                      </span>
                      <CopyButton
                        copyId={usernameCopyId}
                        isCopied={copiedStates[usernameCopyId]}
                        onCopy={() =>
                          handleCopy(item.username, index, "username")
                        }
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Password
                    </label>
                    <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-yellow-200">
                      <span className="flex-1 text-sm font-medium text-gray-900 tracking-wider">
                        {"•".repeat(5)}
                      </span>
                      <CopyButton
                        copyId={passwordCopyId}
                        isCopied={copiedStates[passwordCopyId]}
                        onCopy={() =>
                          handleCopy(item.password, index, "password")
                        }
                      />
                    </div>
                  </div>

                  {/* Notes - Only show if exists */}
                  {item.remarks && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Notes
                      </label>
                      <div className="flex items-start gap-2 bg-purple-50/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-purple-200">
                        <p className="flex-1 text-sm text-gray-700 break-words poppins">
                          {item.remarks}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        itemUrl={deleteModal.itemUrl}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

const DeleteConfirmationModal = ({ isOpen, itemUrl, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 px-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{
              type: "spring",
              duration: 0.5,
              bounce: 0.3,
            }}
            className="relative bg-gradient-to-br from-yellow-50 via-purple-50 to-yellow-100 rounded-3xl shadow-2xl p-10 max-w-md w-full mx-4 border-2 border-yellow-300/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-300/30 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-300/30 rounded-full blur-3xl -z-10"></div>

            <div className="text-center relative">
              <div className="mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-red-100 to-red-200 mb-6 shadow-lg ring-4 ring-red-50"
                >
                  <lord-icon
                    src="https://cdn.lordicon.com/wpyrrmcq.json"
                    trigger="loop"
                    colors="primary:#dc2626,secondary:#fca5a5"
                    style={{ width: "48px", height: "48px" }}
                  ></lord-icon>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-serif font-bold text-gray-900 mb-3 tracking-tight"
                >
                  Delete Password?
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-700 mb-5 text-base leading-relaxed"
                >
                  This will permanently remove your password entry. You won&apos;t be
                  able to recover it.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-yellow-100 to-purple-100 rounded-xl p-4 border-2 border-yellow-300/50 shadow-inner backdrop-blur-sm"
                >
                  <p className="text-sm text-gray-800 font-semibold break-words flex items-center justify-center gap-2">
                    <lord-icon
                      src="https://cdn.lordicon.com/nocovwne.json"
                      trigger="loop"
                      delay="2000"
                      colors="primary:#854d0e"
                      style={{ width: "20px", height: "20px" }}
                    ></lord-icon>
                    <span className="font-serif text-gray-600">URL:</span>
                    <span className="text-gray-900">{itemUrl}</span>
                  </p>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-sm text-red-600 mt-4 font-bold flex items-center justify-center gap-2"
                >
                  This action cannot be undone
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex gap-4 justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onCancel}
                  className="px-8 py-3 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 rounded-xl font-bold hover:from-gray-300 hover:to-gray-400 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <lord-icon
                    src="https://cdn.lordicon.com/nqtddedc.json"
                    trigger="hover"
                    colors="primary:#1f2937"
                    style={{ width: "20px", height: "20px" }}
                  ></lord-icon>
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onConfirm}
                  className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-xl flex items-center gap-2"
                >
                  <lord-icon
                    src="https://cdn.lordicon.com/skkahier.json"
                    trigger="hover"
                    colors="primary:#ffffff"
                    style={{ width: "20px", height: "20px" }}
                  ></lord-icon>
                  Delete
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CopyButton = ({ isCopied, onCopy }) => (
  <div className="relative inline-block">
    <motion.button
      onClick={onCopy}
      className="flex items-center justify-center relative p-1 hover:bg-yellow-200 rounded transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title="Copy to clipboard"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isCopied ? "clipboard" : "copy"}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isCopied ? (
            <Clipboard size={16} className="text-green-600" />
          ) : (
            <Copy size={16} className="text-gray-600" />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>

    {isCopied && (
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-green-500"
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 0.6 }}
      />
    )}
  </div>
);

export default DataTable;
