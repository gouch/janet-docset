/* globals dashDoc  */

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

function createSections(selector) {
  qsa(selector).length > 1 && createEntries(selector, 'Section')
}

function createSymbols(selector) {
  const key = {
    'var (function)': 'Function',
    cfunction: 'Function',
    function: 'Function',
    macro: 'Function',

    'core/file': 'Constant',
    'core/peg': 'Constant',
    array: 'Constant',
    keyword: 'Constant',
    number: 'Constant',
    string: 'Constant',
    struct: 'Constant',
    table: 'Constant',
    tuple: 'Constant',
  }
  qsa(selector).forEach((element) => {
    const type = element?.nextElementSibling?.textContent || 'func'
    createEntry(element, key[type])
  })
}

function main() {
  // Filter redundant full listings
  if (path.endsWith('/api/index.html')) return

  // Packages API
  else if (path.includes('/jpm/api/') || path.includes('/spork/api/')) {
    const pgkName = path.match(/(\w+)\/api\//)[1]
    qs('h1').setAttribute('data-package', pgkName)
    qsa('.binding-sym').forEach((el) =>
      el.setAttribute('data-package', pgkName),
    )

    createEntry(qs('h1'), 'Module')
    createSections('h2')
    createSymbols('.binding-sym')
  }

  // Core API
  else if (path.includes('/api/')) {
    createEntry(qs('h1'), 'Module')
    createSymbols('.binding-sym')
  }

  // Package guides
  else if (path.includes('/jpm/') || path.includes('/spork/')) {
    const pgkName = path.includes('/jpm/') ? 'jpm' : 'spork'
    qs('h1').setAttribute('data-package', pgkName)
    createEntry(qs('h1'), 'Guide')
    createSections('h2')
  }

  // Core guides
  else {
    createEntry(qs('h1'), 'Guide')
    createSections('h2')
  }
}

main()
