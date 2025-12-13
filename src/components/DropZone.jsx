import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileType } from 'lucide-react';

const DropZone = ({ onFileSelect }) => {
    const [isDragActive, setIsDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragActive(true);
        } else if (e.type === 'dragleave') {
            setIsDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files[0]);
        }
    };

    const handleFiles = (file) => {
        if (file.type === 'application/pdf') {
            onFileSelect(file);
        } else {
            alert("Please upload a PDF file.");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative w-full max-w-2xl mx-auto p-12 border-2 border-dashed rounded-2xl transition-all duration-300 ${isDragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 hover:border-indigo-400 hover:bg-slate-800/50'
                }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf"
                onChange={handleChange}
            />

            <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center cursor-pointer text-center"
            >
                <div className={`p-4 rounded-full mb-4 transition-colors ${isDragActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400'}`}>
                    <Upload size={48} />
                </div>

                <h3 className="text-xl font-semibold mb-2 text-slate-200">
                    Drop your PDF here
                </h3>
                <p className="text-slate-400 mb-6">
                    or click to browse from your computer
                </p>

                <span className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
                    Supports client-side conversion for privacy
                </span>
            </label>
        </motion.div>
    );
};

export default DropZone;
