/* Copyright © 2026 David Gouch | MIT License */
/* globals dashDoc */

const path = window.location.pathname
const qs = (selector) => document.querySelector(selector)
const qsa = (selector) => Array.from(document.querySelectorAll(selector))

function createEntry(element, type, name = null) {
  const hash = element.textContent.trim()
  element.setAttribute('id', hash)
  dashDoc.addEntry({
    name: name || element.textContent,
    type: type,
    hash: hash,
  })
}

function createSections(selector) {
  qsa(selector).length > 1 &&
    qsa(selector).forEach((element) => {
      createEntry(element, 'Section')
    })
}

function createSymbols(selector) {
  const typeMap = {
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
    const type = element?.nextElementSibling?.textContent || 'Unknown'
    createEntry(element, typeMap[type])
  })
}

function main() {
  // Remove remote request iframe
  qs('iframe.search-bar').remove()

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

  // Special forms
  else if (path.includes('/specials.html')) {
    createEntry(qs('h1'), 'Guide')
    qsa('h2').forEach((h2) => {
      createEntry(h2, 'Function', h2.textContent.match(/\((\w+)/)[1])
    })
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
    createSections('h3')
  }
}

main()
