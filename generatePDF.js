import puppeteer from "puppeteer-core";
import fs from "fs-extra";
import { PDFDocument, StandardFonts } from "pdf-lib";
import path from "path";
import sharp from "sharp";
import guitar from "./config/guitar.js";

/* ----------------------------------------------------------
   BUILD PATHS GROUPED BY KEY
----------------------------------------------------------- */
function buildPathsByKey() {
    const keys = guitar.notes.sharps;
    const result = {};

    keys.forEach((key) => {
        result[key] = [];

        // 1. Chords (spreading)
        Object.keys(guitar.arppegios).forEach((ch) => {
            result[key].push({
                label: `Chord: ${guitar.arppegios[ch].name} in ${key}`,
                section: "Chords",
                href: `/spreading/chords/${key.replace('#', 'sharp')}/${ch.replace('#', 'sharp')}`
            });
        });

        // 2. Scales (references)
        Object.keys(guitar.scales).forEach((scale) => {
            const sc = guitar.scales[scale];

            if (sc.isModal) {
                sc.modes.forEach((m) => {
                    result[key].push({
                        label: `Scale: ${sc.name} in ${key} (Mode: ${m.name})`,
                        section: "Scales",
                        href: `/spreading/scales/${key.replace('#', 'sharp')}/${scale}/modal/${m.name.toLowerCase().replace(/ /g, '-').replace('#', 'sharp')}`
                    });
                });
            } else {
                result[key].push({
                    label: `Scale: ${sc.name} in ${key} (Single)`,
                    section: "Scales",
                    href: `/spreading/scales/${key.replace('#', 'sharp')}/${scale}/single`
                });
            }
        });

        // 3. Scales (spreading)
        Object.keys(guitar.scales).forEach((scale) => {
            const sc = guitar.scales[scale];

            if (sc.isModal) {
                sc.modes.forEach((m) => {
                    result[key].push({
                        label: `Scale Spread: ${sc.name} in ${key}`,
                        section: "Scales",
                        href: `/spreading/scales/${key.replace('#', 'sharp')}/${scale}/modal/${m.name.toLowerCase().replace(/ /g, '-').replace('#', 'sharp')}`
                    });
                });
            } else {
                result[key].push({
                    label: `Scale Spread: ${sc.name} in ${key}`,
                    section: "Scales",
                    href: `/spreading/scales/${key.replace('#', 'sharp')}/${scale}/single`
                });
            }
        });

        // 5. Arpeggios (spreading)
        Object.keys(guitar.arppegios).forEach((arp) => {
            result[key].push({
                label: `Arpeggio Spread: ${guitar.arppegios[arp].name} in ${key}`,
                section: "Arpeggios",
                href: `/spreading/arppegios/${key.replace('#', 'sharp')}/${arp.replace('#', 'sharp')}`
            });
        });
    });

    return result;
}

/* ----------------------------------------------------------
   CREATE A SECTION TITLE PAGE
----------------------------------------------------------- */
async function createSectionPage(title) {
    const pageWidth = 595;  // A4
    const pageHeight = 842;

    const pdf = await PDFDocument.create();
    const page = pdf.addPage([pageWidth, pageHeight]);

    const font = await pdf.embedFont(StandardFonts.HelveticaBold);
    const fontSize = 48;

    const textWidth = font.widthOfTextAtSize(title, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    const x = (pageWidth - textWidth) / 2;
    const y = (pageHeight - textHeight) / 2 + textHeight;

    page.drawText(title, {
        x,
        y,
        font,
        size: fontSize,
    });

    return pdf;
}

/* ----------------------------------------------------------
   SCREENSHOT + ONE PDF PAGE PER IMAGE
----------------------------------------------------------- */
async function screenshotForKey(key, items) {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-gpu",
            "--disable-dev-shm-usage",
            "--window-size=1400,1200"
        ],
        defaultViewport: { width: 1400, height: 1000 }
    });

    const page = await browser.newPage();

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const url = `https://www.sheets.media${item.href}`;
        console.log(`📸 [${key}] Capturing: ${url}`);

        // Extract relative path to mirror structure
        // e.g., /spreading/scales/C/major -> scales/C/major
        const relativePath = item.href.replace(/^\/(spreading|references)\//, '');
        const imgPathBase = path.join("screens", relativePath);
        const pdfPathBase = path.join("pdf-pages", relativePath);

        await fs.ensureDir(path.dirname(imgPathBase));
        await fs.ensureDir(path.dirname(pdfPathBase));

        try {
            await page.goto(url, {
                waitUntil: "domcontentloaded",
                timeout: 120000
            });

            await page.waitForSelector("canvas, svg", { timeout: 120000 });
            await new Promise(res => setTimeout(res, 2000));

            // Full page screenshot
            const buffer = await page.screenshot({ fullPage: true });
            const meta = await sharp(buffer).metadata();

            // Crop: 60px top, 60px bottom, 100px left, 100px right
            const extractLeft = 100;
            const extractTop = 60;
            const extractWidth = meta.width - 200;
            const extractHeight = meta.height - 120; // 60 top + 60 bottom

            if (extractWidth <= 0 || extractHeight <= 0) {
                console.warn(`      ⚠  Skipping ${url} - invalid crop dimensions (${extractWidth}x${extractHeight})`);
                continue;
            }

            const cropped = await sharp(buffer)
                .extract({
                    left: extractLeft,
                    top: extractTop,
                    width: extractWidth,
                    height: extractHeight
                })
                .png()
                .toBuffer();

            const imgFile = `${imgPathBase}.png`;
            const pdfFile = `${pdfPathBase}.pdf`;

            await fs.writeFile(imgFile, cropped);

            // Create PDF page with matching size (72 DPI assumed for sharp pixel conversion)
            // Note: 1 pixel = 1 point in pdf-lib by default if no scaling applied
            const pdf = await PDFDocument.create();
            const img = await pdf.embedPng(cropped);

            // Set page size to match image pixels exactly
            const pdfPage = pdf.addPage([extractWidth, extractHeight]);
            pdfPage.drawImage(img, {
                x: 0,
                y: 0,
                width: extractWidth,
                height: extractHeight
            });

            await fs.writeFile(pdfFile, await pdf.save());

            item.screenshot = imgFile;
            item.pdfPage = pdfFile;

            console.log(`   ✔  Saved PNG → ${imgFile}`);
            console.log(`   ✔  Saved PDF → ${pdfFile}`);
        } catch (err) {
            console.error(`      ✘  Error capturing ${url}: ${err.message}`);
        }
    }

    await browser.close();
    return items;
}

/* ----------------------------------------------------------
   MERGE ALL PAGES FOR ONE KEY — WITH SECTION TITLES
----------------------------------------------------------- */
async function mergePDF(key, items) {
    const finalPDF = await PDFDocument.create();
    const pdfDir = `./pdf-pages/${key}`;

    let lastSection = null;

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (!item.pdfPage) continue;

        // Insert section page if new
        if (item.section !== lastSection) {
            console.log(`➡️  Adding section title page: ${item.section}`);
            lastSection = item.section;

            const sectionPDF = await createSectionPage(item.section);
            const sectionBytes = await sectionPDF.save();
            const temp = await PDFDocument.load(sectionBytes);
            const [page] = await finalPDF.copyPages(temp, [0]);
            finalPDF.addPage(page);
        }

        // Insert actual item page
        const bytes = await fs.readFile(item.pdfPage);

        const tempPDF = await PDFDocument.load(bytes);
        const [page] = await finalPDF.copyPages(tempPDF, [0]);
        finalPDF.addPage(page);

        console.log(`   ➕  Added page (${item.label})`);
    }

    await fs.ensureDir("./pdf");
    const finalPath = `./pdf/${key}-merged.pdf`;
    await fs.writeFile(finalPath, await finalPDF.save());

    console.log(`\n🎉 MERGED PDF CREATED → ${finalPath}\n`);
}

/* ----------------------------------------------------------
   MAIN SCRIPT
----------------------------------------------------------- */
(async () => {
    const grouped = buildPathsByKey();

    const keys = Object.keys(grouped).slice(1); // Only process 'C' for test
    for (const key of keys) {
        console.log(`\n========================`);
        console.log(`📕 GENERATING PDF FOR ${key}`);
        console.log(`========================`);

        const items = await screenshotForKey(key, grouped[key]);
        await mergePDF(key, items);
    }

    console.log("\n🎉 ALL PDFs GENERATED SUCCESSFULLY!");
})();
