import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString()

/**
 * Extract text from PDF with proper line reconstruction.
 * Sorts items by position, detects line breaks by y-gap, uses hasEOL.
 */
export async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  let fullText = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()

    // Collect valid items with position
    const items = content.items
      .filter((it) => it.str && it.str.trim().length > 0)
      .map((it) => ({
        str: it.str,
        x: Math.round(it.transform[4]),
        y: it.transform[5],          // baseline y in PDF user units
        hasEOL: it.hasEOL || false,
        height: it.height || 0,
      }))

    if (!items.length) continue

    // Sort: descending y (top of page first), then ascending x (left to right)
    items.sort((a, b) => (b.y - a.y) || (a.x - b.x))

    // Estimate line-height from the most common y-gap between adjacent items
    const gaps = []
    for (let j = 1; j < items.length; j++) {
      const d = Math.abs(items[j - 1].y - items[j].y)
      if (d > 0.5 && d < 80) gaps.push(d)
    }
    gaps.sort((a, b) => a - b)
    // Use 25th-percentile gap as "single line spacing"
    const p25 = gaps[Math.floor(gaps.length * 0.25)] || 10
    // Threshold: anything > 40% of a single line = new line
    const threshold = p25 * 0.4

    // Build lines
    let pageLines = []
    let currentLine = []
    let prevY = items[0]?.y ?? 0

    for (const item of items) {
      const yDiff = Math.abs(item.y - prevY)

      if (yDiff > threshold && currentLine.length > 0) {
        pageLines.push(currentLine.join(' ').trim())
        currentLine = []
      }

      currentLine.push(item.str)
      prevY = item.y

      if (item.hasEOL) {
        pageLines.push(currentLine.join(' ').trim())
        currentLine = []
      }
    }

    if (currentLine.length > 0) {
      pageLines.push(currentLine.join(' ').trim())
    }

    fullText += pageLines.filter(Boolean).join('\n') + '\n'
  }

  return fullText
}
