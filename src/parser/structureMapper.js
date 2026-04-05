import { DEFAULT_PROFILE } from '../constants/schema'

// ── Helpers ──────────────────────────────────────────────────────────────────

function clean(str) {
  return (str || '').replace(/\s+/g, ' ').trim()
}

function lines(text) {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
}

// Date range pattern: "Jan 2020 – Mar 2022", "2019 - 2021", "2020–Present"
const DATE_RANGE_RE =
  /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\s*\d{4}\s*[–\-–—]\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\s*\d{4}|Present|Current|Now)/gi

const SECTION_HEADERS = {
  experience: /^(work\s*experience|experience|employment|career|professional\s*experience)/i,
  education: /^(education|academic|qualification)/i,
  skills: /^(skills|technologies|technical\s*skills|tools|competencies)/i,
  projects: /^(projects|personal\s*projects|side\s*projects|portfolio)/i,
  summary: /^(summary|about|objective|profile|bio|overview)/i,
  links: /^(links|contact|social|online\s*presence|profiles)/i,
}

function detectSection(line) {
  for (const [key, re] of Object.entries(SECTION_HEADERS)) {
    if (re.test(line.trim())) return key
  }
  return null
}

// ── Name extraction ───────────────────────────────────────────────────────────

function extractName(rawLines) {
  // Try first 5 lines for a 2-3 word proper-noun name
  for (const line of rawLines.slice(0, 5)) {
    const cleaned = clean(line)
    if (/^[A-Z][a-z]+([\s][A-Z][a-z]+){1,3}$/.test(cleaned) && cleaned.split(' ').length <= 4) {
      return cleaned
    }
  }
  return clean(rawLines[0] || '')
}

// ── Email / location ──────────────────────────────────────────────────────────

function extractEmail(text) {
  const match = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/)
  return match ? match[0] : ''
}

function extractLocation(text) {
  // Match "City, State" or "City, Country" patterns
  const match = text.match(/([A-Z][a-zA-Z\s]+,\s*[A-Z][a-zA-Z\s]+)(?:\s|$|\n)/)
  return match ? clean(match[1]) : ''
}

// ── Links extraction ──────────────────────────────────────────────────────────

function extractLinks(text) {
  const links = { ...DEFAULT_PROFILE.links }

  const patterns = {
    linkedin: /linkedin\.com\/in\/([^\s/,|]+)/i,
    github: /github\.com\/([^\s/,|]+)/i,
    twitter: /(?:twitter|x)\.com\/([^\s/,|]+)/i,
    instagram: /instagram\.com\/([^\s/,|]+)/i,
    youtube: /youtube\.com\/(?:@|channel\/|c\/)?([^\s/,|]+)/i,
    discord: /discord(?:\.gg|\.com\/invite)?\/([^\s/,|]+)/i,
  }

  for (const [key, re] of Object.entries(patterns)) {
    const match = text.match(re)
    if (match) {
      links[key] = match[0].startsWith('http') ? match[0] : 'https://' + match[0]
    }
  }

  return links
}

// ── Experience parsing ────────────────────────────────────────────────────────

function parseExperience(block) {
  const items = []
  const ls = lines(block)
  let current = null

  for (let i = 0; i < ls.length; i++) {
    const line = ls[i]
    const dateMatch = line.match(DATE_RANGE_RE)

    if (dateMatch) {
      // Line with dates — likely a role/company line
      const dateStr = dateMatch[0]
      const rest = line.replace(dateStr, '').trim()
      const parts = rest.split(/\s*[·|•–\-,]\s*/)
      const role = parts[0] ? clean(parts[0]) : ''
      const company = parts[1] ? clean(parts[1]) : ''

      if (current) items.push(current)

      current = {
        company: company || (i > 0 ? clean(ls[i - 1]) : ''),
        role: role,
        start: dateStr.split(/[–\-—]/)[0].trim(),
        end: dateStr.split(/[–\-—]/)[1]?.trim() || '',
        location: '',
        description: '',
      }
    } else if (current && line.length > 20) {
      // Append to description
      current.description += (current.description ? ' ' : '') + clean(line)
    } else if (!current && line.length > 2) {
      // Potential company name before date line
    }
  }

  if (current) items.push(current)
  return items
}

// ── Education parsing ─────────────────────────────────────────────────────────

const DEGREE_RE = /B\.?Tech|B\.?E|B\.?Sc|M\.?Sc|M\.?Tech|MBA|Ph\.?D|Bachelor|Master|Associate|Diploma|High School/i

function parseEducation(block) {
  const items = []
  const ls = lines(block)

  for (let i = 0; i < ls.length; i++) {
    const line = ls[i]
    const isDegree = DEGREE_RE.test(line)
    const hasDate = DATE_RANGE_RE.test(line) || /\b(19|20)\d{2}\b/.test(line)

    if (isDegree || (hasDate && i > 0)) {
      const dateMatch = line.match(/\b(19|20)\d{2}\b(?:\s*[–\-]\s*(?:\b(19|20)\d{2}\b|Present))?/)
      const yearStr = dateMatch ? dateMatch[0] : ''
      const yearParts = yearStr.split(/[–\-]/)

      items.push({
        institution: i > 0 ? clean(ls[i - 1]) : '',
        degree: isDegree ? line.replace(yearStr, '').trim() : '',
        field: '',
        start: yearParts[0]?.trim() || '',
        end: yearParts[1]?.trim() || '',
        gpa: '',
      })
    }
  }

  return items
}

// ── Skills parsing ────────────────────────────────────────────────────────────

function parseSkills(block) {
  const ls = lines(block)
  const categories = []
  let current = null

  for (const line of ls) {
    // Detect category (short line ending with : or all caps)
    if (line.endsWith(':') || (line.length < 30 && /^[A-Z]/.test(line) && !line.includes(','))) {
      if (current) categories.push(current)
      current = { category: line.replace(':', '').trim(), items: [] }
    } else if (line.includes(',')) {
      const skills = line.split(',').map(clean).filter(Boolean)
      if (current) {
        current.items.push(...skills)
      } else {
        // No category label — create generic one
        if (!current) current = { category: 'Skills', items: [] }
        current.items.push(...skills)
      }
    } else if (line.length < 40) {
      if (!current) current = { category: 'Skills', items: [] }
      current.items.push(clean(line))
    }
  }

  if (current && current.items.length > 0) categories.push(current)

  // Fallback: if nothing parsed, dump all words as a flat list
  if (categories.length === 0) {
    const allWords = block
      .split(/[\n,•·|]/)
      .map(clean)
      .filter((s) => s.length > 1 && s.length < 30)
    if (allWords.length > 0) {
      categories.push({ category: 'Skills', items: allWords })
    }
  }

  return categories
}

// ── Projects parsing ──────────────────────────────────────────────────────────

function parseProjects(block) {
  const ls = lines(block)
  const items = []
  let current = null

  for (const line of ls) {
    const hasUrl = /https?:\/\//.test(line) || /github\.com/.test(line)
    const looksLikeName = line.length < 60 && /^[A-Z]/.test(line) && !DATE_RANGE_RE.test(line)

    if (looksLikeName && !hasUrl) {
      if (current) items.push(current)
      current = { name: clean(line), description: '', tech: [], url: '', github: '', youtube: '' }
    } else if (current) {
      if (hasUrl) {
        const urlMatch = line.match(/https?:\/\/[^\s]+/)
        const url = urlMatch ? urlMatch[0] : ''
        if (/github\.com/.test(url)) current.github = url
        else if (/youtube\.com|youtu\.be/.test(url)) current.youtube = url
        else current.url = url
      } else if (line.includes(',') && line.length < 100) {
        // Likely tech stack
        current.tech = line.split(',').map(clean).filter(Boolean)
      } else {
        current.description += (current.description ? ' ' : '') + clean(line)
      }
    }
  }

  if (current) items.push(current)
  return items
}

// ── Summary extraction ────────────────────────────────────────────────────────

function extractSummary(block) {
  return lines(block).slice(0, 5).join(' ')
}

// ── Main mapper ───────────────────────────────────────────────────────────────

/**
 * Map raw text → structured profile data
 * @param {string} rawText
 * @returns {object} structured profile matching DEFAULT_PROFILE schema
 */
export function mapTextToProfile(rawText) {
  const result = JSON.parse(JSON.stringify(DEFAULT_PROFILE))
  const allLines = lines(rawText)

  // Extract metadata from full text
  result.profile.email = extractEmail(rawText)
  result.profile.location = extractLocation(rawText)
  result.links = extractLinks(rawText)

  // Split into sections
  const sections = {}
  let currentSection = 'header'
  let buffer = []

  for (const line of allLines) {
    const detected = detectSection(line)
    if (detected) {
      sections[currentSection] = buffer.join('\n')
      buffer = []
      currentSection = detected
    } else {
      buffer.push(line)
    }
  }
  sections[currentSection] = buffer.join('\n')

  // Parse header block for name + title
  const headerBlock = sections['header'] || allLines.slice(0, 8).join('\n')
  const headerLines = lines(headerBlock)
  result.profile.name = extractName(headerLines)

  // Title: line after name that's short and looks like a job title
  const nameIdx = headerLines.findIndex((l) => clean(l) === result.profile.name)
  if (nameIdx >= 0 && headerLines[nameIdx + 1]) {
    const possibleTitle = clean(headerLines[nameIdx + 1])
    if (possibleTitle.length < 80 && !possibleTitle.includes('@')) {
      result.profile.title = possibleTitle
    }
  }

  if (sections['summary']) {
    result.profile.summary = extractSummary(sections['summary'])
  }

  if (sections['experience']) {
    result.experience = parseExperience(sections['experience'])
  }

  if (sections['education']) {
    result.education = parseEducation(sections['education'])
  }

  if (sections['skills']) {
    result.skills = parseSkills(sections['skills'])
  }

  if (sections['projects']) {
    result.projects = parseProjects(sections['projects'])
  }

  return result
}
