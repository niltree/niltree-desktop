// Packages
import uaParser from 'ua-parser-js'

const regexps = {
  program: [[/\b(niltree)\b/i, 'name'], [/\b(\d+\.\d+\.\d+)\b/, 'version']],
  engine: [[/\b(node)-v(\d+\.\d+\.\d+)\b/i, 'name', 'version']],
  os: [[/\b(darwin|win32|linux|freebsd|sunos)\b/, 'name']],
  cpu: [[/\b(arm|ia32|x64)\b/, 'architecture']]
}

const isNiltreeCLI = ua => ua.startsWith('niltree')

const parseNiltreeCLI = ua => {
  const parsed = { ua }

  Object.keys(regexps).forEach(p1 => {
    regexps[p1].forEach(([re, ...props]) => {
      const match = re.exec(ua)
      if (!match) return

      props.forEach((p2, i) => {
        parsed[p1] = parsed[p1] || {}
        parsed[p1][p2] = match[i + 1]
      })
    })
  })

  return parsed
}

export default ua => {
  const parsed = uaParser(ua)

  if (!parsed.browser.name && isNiltreeCLI(ua)) {
    return parseNiltreeCLI(ua)
  }

  return parsed
}
