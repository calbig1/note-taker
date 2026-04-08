const STORAGE_KEY = 'note-taker-data'

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

export function saveState(state) {
  try {
    // Don't persist canvas imageData — too large. Only persist metadata + strokes.
    const toSave = {
      ...state,
      notebooks: state.notebooks.map(nb => ({
        ...nb,
        pages: nb.pages.map(pg => ({
          ...pg,
          strokes: pg.strokes,
        })),
      })),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  } catch (e) {
    console.warn('Could not save state:', e)
  }
}
