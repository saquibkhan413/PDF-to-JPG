import { jsPDF } from 'jspdf';

/**
 * Converts an array of image files to a single PDF document.
 * @param {File[]} images - Array of image files (JPG/PNG).
 * @returns {Promise<Blob>} - The generated PDF as a Blob.
 */
export const generatePdfFromImages = async (images) => {
    if (!images || images.length === 0) {
        throw new Error("No images provided.");
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const imageData = await readFileAsDataURL(image);

        // Load image to get dimensions
        const imgProps = await getImageProperties(imageData);

        // Calculate scaling to fit page while maintaining aspect ratio
        const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height);
        const imgWidth = imgProps.width * ratio;
        const imgHeight = imgProps.height * ratio;

        // Center image
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;

        if (i > 0) {
            doc.addPage();
        }

        doc.addImage(imageData, 'JPEG', x, y, imgWidth, imgHeight);
    }

    return doc.output('blob');
};

const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const getImageProperties = (dataUrl) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve({ width: img.width, height: img.height });
        };
        img.onerror = reject;
        img.src = dataUrl;
    });
};
