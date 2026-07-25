/* globals $, dashDoc  */

const path = window.location.pathname
const qs = (selector) => document.querySelector(selector)
const qsa = (selector) => Array.from(document.querySelectorAll(selector))

function createEntry(element, type) {
  const hash = element.textContent.trim().replace(/\W/, '-')
  element.setAttribute('id', hash)
  dashDoc.addEntry({
    name: element.textContent,
    type: type,
    hash: hash,
  })
}

function createEntries(selector, type) {
  qsa(selector).forEach((element) => {
    createEntry(element, type)
  })
}

function main() {
  // Skip redundant full listing
  if (path.endsWith('/api/index.html')) return

  // Packages
  else if (
    path.endsWith('/jpm/index.html') ||
    path.endsWith('/spork/index.html')
  ) {
    createEntry(qs('h1'), 'Package')
    createEntries('h2', 'Section')
  }

  // Packages API
  else if (path.includes('/jpm/api/') || path.includes('/spork/api/')) {
    const pgkName = path.match(/(\w+)\/api\//)[1]
    qs('h1').setAttribute('data-package', pgkName)
    qsa('.binding-sym').forEach((el) =>
      el.setAttribute('data-package', pgkName),
    )

    createEntry(qs('h1'), 'Module')
    createEntries('h2', 'Section')
    createEntries('.binding-sym', 'Function')
  }

  // Core API
  else if (path.includes('/api/')) {
    createEntry(qs('h1'), 'Module')
    createEntries('h2', 'Section')
    createEntries('.binding-sym', 'Function')
  }

  // Core general
  else {
    createEntry(qs('h1'), 'Guide')
    createEntries('h2', 'Section')
  }
}

main()
