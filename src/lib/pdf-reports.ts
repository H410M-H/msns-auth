import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function generatePdf(
  data: Array<Record<string, unknown>>,
  headers: Array<{ key: string; label: string }>,
  title: string
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const firstPage = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = firstPage.getSize();
  const margin = 50;
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Header Section
  firstPage.drawText("ACADEMIC INSTITUTE", {
    x: margin,
    y: height - 40,
    size: 18,
    font: boldFont,
    color: rgb(0, 0, 0)
  });

  firstPage.drawText(title, {
    x: margin,
    y: height - 70,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0)
  });

  // Table Configuration
  const startY = height - 100;
  const rowHeight = 20;
  const colWidths = calculateColumnWidths(headers, width - margin * 2);

  // Draw Table Headers
  let xPos = margin;
  headers.forEach((header, index) => {
    firstPage.drawText(header.label, {
      x: xPos,
      y: startY,
      size: 10,
      font: boldFont,
      maxWidth: colWidths[index]
    });
    xPos += colWidths[index];
  });

  // Draw Table Rows
  let currentPage = firstPage;
  let currentY = startY - rowHeight;
  data.forEach((row) => {
    if (currentY < margin) {
      currentPage = pdfDoc.addPage([595.28, 841.89]);
      currentY = currentPage.getSize().height - margin;
    }

    xPos = margin;
    headers.forEach((header, colIndex) => {
      const value = String(row[header.key] ?? ''); // Convert to string and handle undefined
      currentPage.drawText(value, {
        x: xPos,
        y: currentY,
        size: 10,
        font,
        maxWidth: colWidths[colIndex]
      });
      xPos += colWidths[colIndex];
    });

    currentY -= rowHeight;
  });

  return pdfDoc.save();
}

function calculateColumnWidths(
  headers: Array<{ key: string; label: string }>,
  totalWidth: number
): number[] {
  const colCount = headers.length;
  if (colCount === 0) return [];
  const baseWidth = totalWidth / colCount;
  return headers.map(() => baseWidth);
}