import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { loadPdf, renderPageToCanvas } from '../utils/pdfUtils';
import JSZip from 'jszip';
import { Download, Loader2, FileCheck, Image as ImageIcon } from 'lucide-react';

const Converter = ({ file, onReset }) => {
    const [pdfDoc, setPdfDoc] = useState(null);
    const [images, setImages] = useState([]);
    const [status, setStatus] = useState('loading'); // loading, ready, converting, done
    const [progress, setProgress] = useState(0);
    const [isZipping, setIsZipping] = useState(false);

    useEffect(() => {
        const initPdf = async () => {
            try {
                const pdf = await loadPdf(file);
                setPdfDoc(pdf);
                setStatus('ready');
            } catch (error) {
                console.error("Error loading PDF:", error);
                alert("Failed to load PDF. Is it corrupted?");
                onReset();
            }
        };
        initPdf();
    }, [file, onReset]);

    const startConversion = async () => {
        if (!pdfDoc) return;
        setStatus('converting');
        setProgress(0);
        setImages([]);

        const totalPages = pdfDoc.numPages;
        const newImages = [];

        for (let i = 1; i <= totalPages; i++) {
            try {
                const canvas = document.createElement('canvas'); // Off-screen canvas
                // Pass dummy ref
                const result = await renderPageToCanvas(pdfDoc, i, canvas);
                newImages.push(result);
                setImages(prev => [...prev, result]);
                setProgress(Math.round((i / totalPages) * 100));
            } catch (err) {
                console.error(`Error converting page ${i}`, err);
            }
        }
        setStatus('done');
    };

    const downloadZip = async () => {
        setIsZipping(true);
        const zip = new JSZip();
        const folder = zip.folder("converted_images");

        images.forEach((img, idx) => {
            folder.file(`page_${idx + 1}.jpg`, img.blob);
        });

        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${file.name.replace('.pdf', '')}_images.zip`;
        link.click();

        setTimeout(() => URL.revokeObjectURL(url), 1000);
        setIsZipping(false);
    };

    const downloadImage = (blob, index) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `page_${index + 1}.jpg`;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-4xl mx-auto"
        >
            {/* Header Info */}
            <div className="glass-panel p-6 mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-400">
                        <FileCheck size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">{file.name}</h2>
                        <p className="text-slate-400 text-sm">
                            {pdfDoc ? `${pdfDoc.numPages} Pages` : 'Loading information...'} • {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={onReset} className="btn btn-secondary text-sm">
                        Upload New
                    </button>
                    {status === 'ready' && (
                        <button onClick={startConversion} className="btn">
                            Convert to JPG
                        </button>
                    )}
                    {status === 'done' && (
                        <button onClick={downloadZip} disabled={isZipping} className="btn bg-green-600 hover:bg-green-700">
                            {isZipping ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                            Download All (ZIP)
                        </button>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            {status === 'converting' && (
                <div className="mb-8 p-6 glass-panel text-center">
                    <div className="flex justify-between text-sm mb-2 text-slate-300">
                        <span>Converting...</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-indigo-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ ease: "linear" }}
                        />
                    </div>
                </div>
            )}

            {/* Grid of Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((img, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="glass-panel p-3 group relative"
                    >
                        <div className="aspect-[3/4] w-full bg-slate-800 rounded-lg overflow-hidden relative mb-3">
                            <img
                                src={URL.createObjectURL(img.blob)}
                                alt={`Page ${idx + 1}`}
                                className="w-full h-full object-contain"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => downloadImage(img.blob, idx)}
                                    className="p-3 bg-white rounded-full text-indigo-600 hover:scale-110 transition-transform"
                                    title="Download Image"
                                >
                                    <Download size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center px-1">
                            <span className="text-sm text-slate-400">Page {idx + 1}</span>
                            <span className="text-xs text-slate-600 uppercase">JPG</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default Converter;
