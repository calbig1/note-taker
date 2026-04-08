import { v4 as uuidv4 } from 'uuid'

export function createPage(overrides = {}) {
  return {
    id: uuidv4(),
    name: 'Page 1',
    paperType: 'lined',       // 'lined' | 'unlined' | 'dotgrid' | 'whiteboard'
    paperColor: 'white',      // 'white' | 'black' | 'beige'
    lineSpacing: 32,          // px between lines (for lined/dotgrid)
    strokes: [],
    textElements: [],
    ...overrides,
  }
}

export function createNotebook(overrides = {}) {
  const id = uuidv4()
  const page = createPage({ name: 'Page 1' })
  return {
    id,
    name: 'My Notebook',
    coverColor: '#e74c3c',
    pages: [page],
    ...overrides,
  }
}

export function getInitialState() {
  const nb1 = createNotebook({ name: 'My Notebook', coverColor: '#e74c3c' })
  const nb2 = createNotebook({
    name: 'Whiteboard',
    coverColor: '#2980b9',
    pages: [createPage({ name: 'Board 1', paperType: 'whiteboard', paperColor: 'white' })],
  })
  return {
    notebooks: [nb1, nb2],
    activeNotebookId: nb1.id,
    activePageId: nb1.pages[0].id,
  }
}
