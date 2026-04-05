import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString()

/**
 * Extract text from PDF preserving line structure using y-coordinate grouping
 * @param {File} file
 * @returns {Promise<string>}
 */
export async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  let fullText = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()

    // Group text items by their y-position (rounded to nearest 2px)
    // Items on the same horizontal line share similar y values
    const lineMap = new Map()

    for (const item of content.items) {
      if (!item.str?.trim()) continue
      // item.transform = [scaleX, skewX, skewY, scaleY, x, y]
      const y = Math.round(item.transform[5] / 2) * 2
      if (!lineMap.has(y)) lineMap.set(y, [])
      lineMap.get(y).push({ x: item.transform[4], str: item.str })
    }

    // Sort lines: descending y = top of page first
    // Sort items within each line: ascending x = left to right
    const sortedLines = [...lineMap.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([, items]) => {
        const sorted = items.sort((a, b) => a.x - b.x)
        return sorted.map((it) => it.str).join(' ').trim()
      })
      .filter(Boolean)

    fullText += sortedLines.join('\n') + '\n'
  }

  return fullText
}
