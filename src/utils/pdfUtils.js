import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker
// Using a CDN for simplicity and reliability across environments, 
// though local import via 'pdfjs-dist/build/pdf.worker?url' is also an option.
// For now, let's use the version matching the installed package.
// We'll use a dynamic import or the typical Vite setup.

// Vite-friendly worker setup
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const loadPdf = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    return loadingTask.promise;
};

export const renderPageToCanvas = async (pdfDoc, pageNum, canvasRef, scale = 2) => {
    if (!canvasRef) return;

    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    const canvas = canvasRef;
    const context = canvas.getContext('2d');

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
        canvasContext: context,
        viewport: viewport,
    };

    await page.render(renderContext).promise;

    // Return the blob for the rendered image
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve({
                blob,
                width: viewport.width,
                height: viewport.height,
                pageNum
            });
        }, 'image/jpeg', 0.95); // High quality JPG
    });
};
