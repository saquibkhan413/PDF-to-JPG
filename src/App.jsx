import React, { useState } from 'react';
import DropZone from './components/DropZone';
import Converter from './components/Converter';
import JpgToPdfConverter from './components/JpgToPdfConverter';
import { motion, AnimatePresence } from 'framer-motion';
import { FileHeart, Github, Zap } from 'lucide-react';

function App() {
  const [file, setFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [mode, setMode] = useState('pdf-to-jpg'); // 'pdf-to-jpg' | 'jpg-to-pdf'

  const handleFileSelect = (selected) => {
    if (mode === 'pdf-to-jpg') {
      setFile(selected);
    } else {
      // DropZone returns array for multiple, single file otherwise
      // For jpg-to-pdf we expect an array or single file, but our new DropZone logic for multiple=true returns array
      const list = Array.isArray(selected) ? selected : [selected];
      setFileList(prev => [...prev, ...list]);
    }
  };

  const reset = () => {
    setFile(null);
    setFileList([]);
  };

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/5 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-2 rounded-lg">
              <FileHeart className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              PDF2JPG
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <Github size={20} />
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container flex flex-col items-center justify-center relative z-10 py-12">

        {/* Mode Toggler */}
        {!file && fileList.length === 0 && (
          <div className="bg-white/5 p-1 rounded-xl flex items-center mb-12 border border-white/10">
            <button
              onClick={() => setMode('pdf-to-jpg')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'pdf-to-jpg' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              PDF to JPG
            </button>
            <button
              onClick={() => setMode('jpg-to-pdf')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'jpg-to-pdf' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              JPG to PDF
            </button>
          </div>
        )}

        <AnimatePresence mode='wait'>
          {(!file && fileList.length === 0) ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex flex-col items-center text-center"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm mb-6 animate-pulse-ring">
                <Zap size={14} />
                <span>100% Client-Side Conversion</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                {mode === 'pdf-to-jpg' ? 'Convert PDF to ' : 'Convert Images to '}
                <span className="title-gradient">{mode === 'pdf-to-jpg' ? 'High-Res JPG' : 'Single PDF'}</span>
              </h1>

              <p className="text-lg text-slate-400 max-w-2xl mb-12">
                Securely convert your documents without them ever leaving your device.
                Premium quality, lightning fast, and completely free.
              </p>

              <DropZone
                onFileSelect={handleFileSelect}
                accept={mode === 'pdf-to-jpg' ? { "application/pdf": [".pdf"] } : { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] }}
                multiple={mode === 'jpg-to-pdf'}
                text={mode === 'pdf-to-jpg' ? "Drop your PDF here" : "Drop your Images (JPG/PNG)"}
              />

              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-4xl w-full">
                {[
                  { title: "Private", desc: "Files never upload to any server." },
                  { title: "Fast", desc: "Powered by WebAssembly for speed." },
                  { title: "Free", desc: "No limits, no watermarks." }
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="converter"
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              {mode === 'pdf-to-jpg' && file && (
                <Converter file={file} onReset={reset} />
              )}
              {mode === 'jpg-to-pdf' && fileList.length > 0 && (
                <JpgToPdfConverter files={fileList} onReset={reset} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-6 text-center text-slate-600 text-sm relative z-10">
        <p>© {new Date().getFullYear()} PDF2JPG. Built with React & Vite.</p>
      </footer>
    </div>
  );
}

export default App;
