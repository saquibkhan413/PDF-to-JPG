import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, RefreshCw, X, FileImage, ArrowUp, ArrowDown } from 'lucide-react';
import { generatePdfFromImages } from '../utils/pdfGenerator';

const JpgToPdfConverter = ({ files, onReset }) => {
    const [isConverting, setIsConverting] = useState(false);
    const [fileList, setFileList] = useState(files || []);

    const handleConvert = async () => {
        setIsConverting(true);
        try {
            const pdfBlob = await generatePdfFromImages(fileList);
            const url = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'converted_images.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error(error);
            alert("Error generating PDF");
        } finally {
            setIsConverting(false);
        }
    };

    const removeFile = (index) => {
        setFileList(prev => prev.filter((_, i) => i !== index));
        if (fileList.length <= 1) {
            onReset();
        }
    };

    const moveFile = (index, direction) => {
        if (direction === 'up' && index > 0) {
            const newFiles = [...fileList];
            [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
            setFileList(newFiles);
        } else if (direction === 'down' && index < fileList.length - 1) {
            const newFiles = [...fileList];
            [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
            setFileList(newFiles);
        }
    };

    if (fileList.length === 0) {
        onReset();
        return null;
    }

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        {fileList.length} Image{fileList.length !== 1 && 's'} Selected
                    </h2>
                    <button
                        onClick={onReset}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto mb-8 pr-2 custom-scrollbar">
                    {fileList.map((file, index) => (
                        <motion.div
                            key={`${file.name}-${index}`}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl hover:border-indigo-500/30 transition-colors group"
                        >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                    <FileImage size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-slate-200 font-medium truncate">{file.name}</p>
                                    <p className="text-sm text-slate-500">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex flex-col gap-1 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => moveFile(index, 'up')}
                                        disabled={index === 0}
                                        className="p-1 text-slate-400 hover:text-indigo-400 disabled:opacity-30"
                                    >
                                        <ArrowUp size={14} />
                                    </button>
                                    <button
                                        onClick={() => moveFile(index, 'down')}
                                        disabled={index === fileList.length - 1}
                                        className="p-1 text-slate-400 hover:text-indigo-400 disabled:opacity-30"
                                    >
                                        <ArrowDown size={14} />
                                    </button>
                                </div>
                                <button
                                    onClick={() => removeFile(index)}
                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                    <button
                        onClick={onReset}
                        className="px-6 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 font-medium transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConvert}
                        disabled={isConverting}
                        className={`
                            px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 
                            text-white font-medium shadow-lg shadow-indigo-900/20 
                            flex items-center gap-2 transition-all
                            ${isConverting ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 hover:shadow-indigo-600/30'}
                        `}
                    >
                        {isConverting ? (
                            <>
                                <RefreshCw className="animate-spin" size={20} />
                                Generating PDF...
                            </>
                        ) : (
                            <>
                                <Download size={20} />
                                Download PDF
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JpgToPdfConverter;
