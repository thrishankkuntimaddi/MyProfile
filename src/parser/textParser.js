/**
 * Read plain text from a TXT or DOC file using FileReader
 * @param {File} file
 * @returns {Promise<string>}
 */
export function extractTextFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result || '')
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
