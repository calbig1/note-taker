import { useState, useEffect, useRef, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Toolbar from './components/Toolbar'
import Canvas from './components/Canvas'
import PageSettings from './components/PageSettings'
import HomeScreen from './components/HomeScreen'
import NotebookView from './components/NotebookView'
import { loadState, saveState } from './utils/storage'
import { getInitialState, createPage, createNotebook } from './utils/initialState'
import styles from './App.module.css'

const MAX_HISTORY = 60
const MAX_RECENT = 20

// ── Splash Screen ────────────────────────────────────────────────────────────
function SplashScreen({ onDone }) {
  const [hiding, setHiding] = useState(false)
  useEffect(() => {
    const t1 = setTimeout(() => setHiding(true), 1400)
    const t2 = setTimeout(() => onDone(), 1900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])

  return (
    <div className={`${styles.splash} ${hiding ? styles.splashHide : ''}`}>
      <div className={styles.splashContent}>
        <div className={styles.splashLogoWrap}>
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <rect width="72" height="72" rx="20" fill="#6366F1"/>
            <rect x="14" y="10" width="44" height="52" rx="6" fill="white" fillOpacity="0.15"/>
            <rect x="18" y="10" width="40" height="52" rx="6" fill="white"/>
            <rect x="14" y="10" width="9" height="52" rx="4.5" fill="white" fillOpacity="0.45"/>
            <rect x="27" y="24" width="22" height="2.5" rx="1.25" fill="#6366F1" fillOpacity="0.5"/>
            <rect x="27" y="32" width="17" height="2.5" rx="1.25" fill="#6366F1" fillOpacity="0.4"/>
            <rect x="27" y="40" width="20" height="2.5" rx="1.25" fill="#6366F1" fillOpacity="0.3"/>
            <rect x="27" y="48" width="13" height="2.5" rx="1.25" fill="#6366F1" fillOpacity="0.2"/>
          </svg>
        </div>
        <h1 className={styles.splashTitle}>Note Taker</h1>
        <p className={styles.splashSub}>Your digital notebook</p>
        <div className={styles.splashSpinner} />
      </div>
    </div>
  )
}

// ── Keyboard Shortcuts Modal ─────────────────────────────────────────────────
function ShortcutsModal({ onClose }) {
  const shortcuts = [
    { key: 'P', desc: 'Ballpoint pen' },
    { key: 'F', desc: 'Fountain pen' },
    { key: 'B', desc: 'Brush' },
    { key: 'C', desc: 'Pencil' },
    { key: 'H', desc: 'Highlighter' },
    { key: 'E', desc: 'Eraser' },
    { key: 'S', desc: 'Select' },
    { key: 'L', desc: 'Lasso select' },
    { key: 'T', desc: 'Text tool' },
    { key: '⌘Z', desc: 'Undo' },
    { key: '⌘⇧Z', desc: 'Redo' },
    { key: '+', desc: 'Zoom in' },
    { key: '-', desc: 'Zoom out' },
    { key: '⌘0', desc: 'Reset zoom' },
    { key: 'Del', desc: 'Delete selected' },
    { key: 'Esc', desc: 'Cancel / deselect' },
  ]
  return (
    <div className={styles.shortcutsOverlay} onClick={onClose}>
      <div className={styles.shortcutsPanel} onClick={e => e.stopPropagation()}>
        <div className={styles.shortcutsHeader}>
          <h2 className={styles.shortcutsTitle}>Keyboard Shortcuts</h2>
          <button className={styles.shortcutsClose} onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="14" y1="2" x2="2" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className={styles.shortcutsGrid}>
          {shortcuts.map(({ key, desc }) => (
            <div key={key} className={styles.shortcutRow}>
              <kbd className={styles.shortcutKey}>{key}</kbd>
              <span className={styles.shortcutDesc}>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [loading, setLoading] = useState(true)
  const [state, setState] = useState(() => loadState() ?? getInitialState())
  const [view, setView] = useState('home')
  const [penType, setPenType] = useState('ballpoint')
  const [shapeType, setShapeType] = useState('rect')
  const [color, setColor] = useState('#000000')
  const [size, setSize] = useState(4)
  const [zoom, setZoom] = useState(1)
  const [showPageSettings, setShowPageSettings] = useState(false)
  const [wristGuard, setWristGuard] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [darkMode, setDarkMode] = useState(true)

  // Favorites: array of notebook IDs
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nt_favorites') ?? '[]') } catch { return [] }
  })

  // Recent notebooks: [{ id, openedAt }]
  const [recentNotebooks, setRecentNotebooks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nt_recent') ?? '[]') } catch { return [] }
  })

  useEffect(() => { localStorage.setItem('nt_favorites', JSON.stringify(favorites)) }, [favorites])
  useEffect(() => { localStorage.setItem('nt_recent', JSON.stringify(recentNotebooks)) }, [recentNotebooks])

  const historyRef = useRef({})
  const canvasRef = useRef(null)

  useEffect(() => { saveState(state) }, [state])

  useEffect(() => {
    if (view !== 'editor') return
    function onKey(e) {
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key === 'z' && !e.shiftKey) { e.preventDefault(); handleUndo() }
      if (mod && (e.key === 'Z' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); handleRedo() }
      if (e.key === 'p') setPenType('ballpoint')
      if (e.key === 'f') setPenType('fountain')
      if (e.key === 'b') setPenType('brush')
      if (e.key === 'c') setPenType('pencil')
      if (e.key === 'h') setPenType('highlighter')
      if (e.key === 'e') setPenType('eraser')
      if (e.key === 's') setPenType('select')
      if (e.key === 'l') setPenType('lasso')
      if (e.key === 't') setPenType('text')
      if (e.key === '=' || e.key === '+') setZoom(z => Math.min(3, +(z + 0.1).toFixed(2)))
      if (e.key === '-') setZoom(z => Math.max(0.25, +(z - 0.1).toFixed(2)))
      if (mod && e.key === '0') { e.preventDefault(); setZoom(1) }
      if (e.key === '?') setShowShortcuts(s => !s)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [view, state])

  const activeNotebook = state.notebooks.find(n => n.id === state.activeNotebookId)
  const activePage = activeNotebook?.pages.find(p => p.id === state.activePageId)
  const activePageIndex = activeNotebook?.pages.findIndex(p => p.id === state.activePageId) ?? -1
  const hasPrevPage = activePageIndex > 0
  const hasNextPage = activeNotebook ? activePageIndex < activeNotebook.pages.length - 1 : false

  function getHistory(pageId) {
    if (!historyRef.current[pageId]) historyRef.current[pageId] = { past: [], future: [] }
    return historyRef.current[pageId]
  }

  function updatePageData(pageId, updates) {
    setState(prev => ({
      ...prev,
      notebooks: prev.notebooks.map(nb => ({
        ...nb,
        pages: nb.pages.map(pg => pg.id === pageId ? { ...pg, ...updates } : pg),
      })),
    }))
  }

  const handleStrokesChange = useCallback((updater) => {
    if (!activePage) return
    const pageId = activePage.id
    const history = getHistory(pageId)
    setState(prev => {
      const nb = prev.notebooks.find(n => n.id === prev.activeNotebookId)
      const pg = nb?.pages.find(p => p.id === pageId)
      if (!pg) return prev
      const newStrokes = typeof updater === 'function' ? updater(pg.strokes) : updater
      history.past = [...history.past.slice(-MAX_HISTORY), pg.strokes]
      history.future = []
      return {
        ...prev,
        notebooks: prev.notebooks.map(n => ({
          ...n,
          pages: n.pages.map(p => p.id === pageId ? { ...p, strokes: newStrokes } : p),
        })),
      }
    })
  }, [activePage])

  const handleTextElementsChange = useCallback((updater) => {
    if (!activePage) return
    const pageId = activePage.id
    setState(prev => {
      const nb = prev.notebooks.find(n => n.id === prev.activeNotebookId)
      const pg = nb?.pages.find(p => p.id === pageId)
      if (!pg) return prev
      const newElements = typeof updater === 'function' ? updater(pg.textElements ?? []) : updater
      return {
        ...prev,
        notebooks: prev.notebooks.map(n => ({
          ...n,
          pages: n.pages.map(p => p.id === pageId ? { ...p, textElements: newElements } : p),
        })),
      }
    })
  }, [activePage])

  function handleUndo() {
    if (!activePage) return
    const history = getHistory(activePage.id)
    if (history.past.length === 0) return
    const prev = history.past[history.past.length - 1]
    history.past = history.past.slice(0, -1)
    history.future = [activePage.strokes, ...history.future]
    updatePageData(activePage.id, { strokes: prev })
  }

  function handleRedo() {
    if (!activePage) return
    const history = getHistory(activePage.id)
    if (history.future.length === 0) return
    const next = history.future[0]
    history.future = history.future.slice(1)
    history.past = [...history.past, activePage.strokes]
    updatePageData(activePage.id, { strokes: next })
  }

  function recordRecent(id) {
    setRecentNotebooks(prev => {
      const filtered = prev.filter(r => r.id !== id)
      return [{ id, openedAt: Date.now() }, ...filtered].slice(0, MAX_RECENT)
    })
  }

  function handleOpenNotebook(id) {
    const nb = state.notebooks.find(n => n.id === id)
    if (!nb) return
    recordRecent(id)
    setState(prev => ({ ...prev, activeNotebookId: id, activePageId: nb.pages[0]?.id ?? prev.activePageId }))
    setView('notebook')
  }

  function handleOpenPage(notebookId, pageId) {
    setState(prev => ({ ...prev, activeNotebookId: notebookId, activePageId: pageId }))
    setZoom(1)
    setView('editor')
  }

  function handleAddPageAndOpen(notebookId) {
    const nb = state.notebooks.find(n => n.id === notebookId)
    if (!nb) return
    const lastPage = nb.pages[nb.pages.length - 1]
    const newPage = createPage({
      name: `Page ${nb.pages.length + 1}`,
      paperType: lastPage?.paperType ?? 'lined',
      paperColor: lastPage?.paperColor ?? 'white',
      lineSpacing: lastPage?.lineSpacing ?? 32,
    })
    setState(prev => ({
      ...prev,
      notebooks: prev.notebooks.map(n => n.id === notebookId ? { ...n, pages: [...n.pages, newPage] } : n),
      activeNotebookId: notebookId,
      activePageId: newPage.id,
    }))
    setZoom(1)
    setView('editor')
  }

  function handlePrevPage() {
    if (!activeNotebook || activePageIndex <= 0) return
    setState(prev => ({ ...prev, activePageId: activeNotebook.pages[activePageIndex - 1].id }))
  }

  function handleNextPage() {
    if (!activeNotebook || activePageIndex >= activeNotebook.pages.length - 1) return
    setState(prev => ({ ...prev, activePageId: activeNotebook.pages[activePageIndex + 1].id }))
  }

  function handleAddNotebook(name, coverColor, isQuickNotes = false) {
    const nb = createNotebook({ name, coverColor, isQuickNotes })
    setState(prev => ({ ...prev, notebooks: [...prev.notebooks, nb], activeNotebookId: nb.id, activePageId: nb.pages[0].id }))
  }

  function handleRenameNotebook(id, name) {
    setState(prev => ({ ...prev, notebooks: prev.notebooks.map(n => n.id === id ? { ...n, name } : n) }))
  }

  function handleDeleteNotebook(id) {
    setState(prev => {
      const remaining = prev.notebooks.filter(n => n.id !== id)
      if (remaining.length === 0) return prev
      const newActive = remaining[0]
      return {
        ...prev,
        notebooks: remaining,
        activeNotebookId: prev.activeNotebookId === id ? newActive.id : prev.activeNotebookId,
        activePageId: prev.activeNotebookId === id ? newActive.pages[0]?.id : prev.activePageId,
      }
    })
    setFavorites(f => f.filter(fid => fid !== id))
    setRecentNotebooks(r => r.filter(rec => rec.id !== id))
    if (state.activeNotebookId === id) setView('home')
  }

  function handleToggleFavorite(id) {
    setFavorites(f => f.includes(id) ? f.filter(fid => fid !== id) : [...f, id])
  }

  function handleAddPage(notebookId) {
    setState(prev => {
      const nb = prev.notebooks.find(n => n.id === notebookId)
      if (!nb) return prev
      const lastPage = nb.pages[nb.pages.length - 1]
      const newPage = createPage({
        name: `Page ${nb.pages.length + 1}`,
        paperType: lastPage?.paperType ?? 'lined',
        paperColor: lastPage?.paperColor ?? 'white',
        lineSpacing: lastPage?.lineSpacing ?? 32,
      })
      return {
        ...prev,
        notebooks: prev.notebooks.map(n => n.id === notebookId ? { ...n, pages: [...n.pages, newPage] } : n),
        activeNotebookId: notebookId,
        activePageId: newPage.id,
      }
    })
  }

  function handleRenamePage(notebookId, pageId, name) {
    setState(prev => ({
      ...prev,
      notebooks: prev.notebooks.map(nb =>
        nb.id === notebookId
          ? { ...nb, pages: nb.pages.map(pg => pg.id === pageId ? { ...pg, name } : pg) }
          : nb
      ),
    }))
  }

  function handleDeletePage(notebookId, pageId) {
    setState(prev => {
      const nb = prev.notebooks.find(n => n.id === notebookId)
      if (!nb || nb.pages.length <= 1) return prev
      const remaining = nb.pages.filter(p => p.id !== pageId)
      return {
        ...prev,
        notebooks: prev.notebooks.map(n => n.id === notebookId ? { ...n, pages: remaining } : n),
        activePageId: prev.activePageId === pageId ? remaining[0].id : prev.activePageId,
      }
    })
  }

  function handleDuplicatePage(notebookId, pageId) {
    setState(prev => {
      const nb = prev.notebooks.find(n => n.id === notebookId)
      if (!nb) return prev
      const pg = nb.pages.find(p => p.id === pageId)
      if (!pg) return prev
      const newPage = createPage({
        name: pg.name + ' (copy)',
        paperType: pg.paperType,
        paperColor: pg.paperColor,
        lineSpacing: pg.lineSpacing,
        strokes: pg.strokes.map(s => ({ ...s, id: uuidv4() })),
        textElements: (pg.textElements ?? []).map(e => ({ ...e, id: uuidv4() })),
      })
      const idx = nb.pages.findIndex(p => p.id === pageId)
      const newPages = [...nb.pages.slice(0, idx + 1), newPage, ...nb.pages.slice(idx + 1)]
      return { ...prev, notebooks: prev.notebooks.map(n => n.id === notebookId ? { ...n, pages: newPages } : n) }
    })
  }

  function handleUpdatePageSettings(updates) {
    if (!activePage) return
    updatePageData(activePage.id, updates)
  }

  function handleExport() {
    const dataUrl = canvasRef.current?.exportPNG()
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `${activePage?.name ?? 'page'}.png`
    a.click()
  }

  const history = activePage ? getHistory(activePage.id) : { past: [], future: [] }

  if (loading) return <SplashScreen onDone={() => setLoading(false)} />

  if (view === 'home') {
    return (
      <HomeScreen
        notebooks={state.notebooks}
        onOpenNotebook={handleOpenNotebook}
        onAddNotebook={handleAddNotebook}
        onRenameNotebook={handleRenameNotebook}
        onDeleteNotebook={handleDeleteNotebook}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        recentNotebooks={recentNotebooks}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(d => !d)}
      />
    )
  }

  if (view === 'notebook') {
    return (
      <NotebookView
        notebook={activeNotebook}
        onBack={() => setView('home')}
        onOpenPage={handleOpenPage}
        onAddPage={handleAddPageAndOpen}
        onRenamePage={handleRenamePage}
        onDeletePage={handleDeletePage}
        onDuplicatePage={handleDuplicatePage}
      />
    )
  }

  return (
    <div className={styles.editor}>
      <Toolbar
        penType={penType} setPenType={setPenType}
        shapeType={shapeType} setShapeType={setShapeType}
        color={color} setColor={setColor}
        size={size} setSize={setSize}
        zoom={zoom} setZoom={setZoom}
        onUndo={handleUndo} onRedo={handleRedo}
        canUndo={history.past.length > 0} canRedo={history.future.length > 0}
        onExport={handleExport}
        onOpenPageSettings={() => setShowPageSettings(true)}
        onShowShortcuts={() => setShowShortcuts(true)}
        notebookName={activeNotebook?.name ?? ''}
        pageName={activePage?.name ?? ''}
        onBack={() => setView('notebook')}
        onPrevPage={handlePrevPage} onNextPage={handleNextPage}
        hasPrevPage={hasPrevPage} hasNextPage={hasNextPage}
        pageIndex={activePageIndex} pageTotal={activeNotebook?.pages.length ?? 0}
        wristGuard={wristGuard} onToggleWristGuard={() => setWristGuard(w => !w)}
      />

      <div className={styles.canvasArea}>
        {activePage ? (
          <Canvas
            ref={canvasRef}
            page={activePage}
            penType={penType}
            shapeType={shapeType}
            color={color}
            size={size}
            zoom={zoom}
            onStrokesChange={handleStrokesChange}
            onTextElementsChange={handleTextElementsChange}
            wristGuard={wristGuard}
          />
        ) : (
          <div className={styles.empty}>No page selected</div>
        )}
      </div>

      {showPageSettings && activePage && (
        <PageSettings
          page={activePage}
          onUpdate={handleUpdatePageSettings}
          onClose={() => setShowPageSettings(false)}
        />
      )}

      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
    </div>
  )
}
