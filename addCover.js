import fs from "fs-extra";
import path from "path";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";

const coversDir = "./covers";
const pdfDir = "./pdf";
const finalDir = "./final";

// A4 dimensions in points (72 DPI)
const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;

async function convertCoverToPDF(key) {
    const inputImage = path.join(coversDir, `${key}.png`);
    const outputPDF = path.join(coversDir, `${key}.pdf`);

    if (!fs.existsSync(inputImage)) {
        console.log(`❌ Cover image missing for key: ${key}`);
        return null;
    }

    // Convert image to PNG buffer resized to A4
    const pngBuffer = await sharp(inputImage)
        .resize({
            width: Math.floor(A4_WIDTH),
            height: Math.floor(A4_HEIGHT),
            fit: "cover"
        })
        .png()
        .toBuffer();

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);

    const img = await pdfDoc.embedPng(pngBuffer);
    page.drawImage(img, {
        x: 0,
        y: 0,
        width: A4_WIDTH,
        height: A4_HEIGHT
    });

    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(outputPDF, pdfBytes);

    console.log(`📄 Created A4 PDF cover: ${outputPDF}`);
    return outputPDF;
}

async function mergeCoverAndBook(key) {
    const coverPDF = path.join(coversDir, `${key}.pdf`);
    const bookPDF = path.join(pdfDir, `${key}-merged.pdf`);
    const outputFinal = path.join(finalDir, `${key}-final.pdf`);

    if (!fs.existsSync(coverPDF) || !fs.existsSync(bookPDF)) {
        console.log(`❌ Missing PDF for merging: ${key}`);
        return;
    }

    const finalDoc = await PDFDocument.create();

    // Load cover
    const coverBytes = await fs.readFile(coverPDF);
    const coverDoc = await PDFDocument.load(coverBytes);
    const [coverPage] = await finalDoc.copyPages(coverDoc, [0]);
    finalDoc.addPage(coverPage);

    // Load merged book
    const bookBytes = await fs.readFile(bookPDF);
    const bookDoc = await PDFDocument.load(bookBytes);
    const bookPages = await finalDoc.copyPages(
        bookDoc,
        bookDoc.getPageIndices()
    );
    bookPages.forEach(p => finalDoc.addPage(p));

    await fs.ensureDir(finalDir);
    const finalBytes = await finalDoc.save();
    await fs.writeFile(outputFinal, finalBytes);

    console.log(`✅ Final PDF created: ${outputFinal}`);
}

async function main() {
    const files = await fs.readdir(coversDir);

    // detect keys: extracts "C", "C#", "D", ...
    const keys = files
        .filter(f => f.endsWith(".png"))
        .map(f => path.basename(f, ".png"));

    for (const key of keys) {
        console.log(`\n=== Processing key: ${key} ===`);

        await convertCoverToPDF(key);
        await mergeCoverAndBook(key);
    }

    console.log("\n🎉 ALL DONE!");
}

main().catch(err => console.error(err));
