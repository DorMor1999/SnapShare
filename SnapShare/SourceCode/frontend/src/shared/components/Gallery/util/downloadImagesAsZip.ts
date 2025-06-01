import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export interface ImageToDownload {
  url: string;
  name: string; // Can be with or without extension
}

function getFileExtension(url: string): string {
  const match = url.match(/\.[0-9a-z]+(?=[?#])|(\.)(?:[\w]+)$/gi);
  return match ? match[0] : '';
}

export async function downloadImagesAsZip(
  images: ImageToDownload[],
  zipName: string = 'images.zip'
) {
  const zip = new JSZip();

  await Promise.all(
    images.map(async (img, idx) => {
      try {
        const response = await fetch(img.url);
        if (!response.ok) throw new Error(`Failed to fetch ${img.url}`);
        const blob = await response.blob();

        // Ensure filename has an extension
        let fileName = img.name;
        if (!/\.[a-zA-Z0-9]+$/.test(fileName)) {
          fileName += getFileExtension(img.url) || '.jpeg'; // Default to .jpeg if no extension found
        }

        zip.file(fileName, blob);
      } catch (e) {
        console.error(`Error downloading ${img.url}:`, e);
      }
    })
  );

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, zipName);
}