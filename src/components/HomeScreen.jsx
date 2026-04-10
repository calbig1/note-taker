import { useState, useRef, useEffect } from 'react'
import styles from './HomeScreen.module.css'
import {
  SearchIcon, PlusIcon, TrashIcon, DotsIcon, NotebookIcon,
} from './ToolIcons'

const COVER_COLORS = [
  '#E84040', '#FF6B35', '#FF9F1C', '#2EC4B6',
  '#7C6EF8', '#5856D6', '#AF52DE', '#FF2D55',
  '#3FD97B', '#636366', '#1C1C2E', '#8E8E93',
]

function darken(hex, amt = 0.25) {
  const c = hex.replace('#', '')
  if (c.length !== 6) return hex
  return '#' + [0, 2, 4].map(i => {
    const v = Math.round(parseInt(c.slice(i, i + 2), 16) * (1 - amt))
    return Math.max(0, v).toString(16).padStart(2, '0')
  }).join('')
}

function lighten(hex, amt = 0.2) {
  const c = hex.replace('#', '')
  if (c.length !== 6) return hex
  return '#' + [0, 2, 4].map(i => {
    const v = Math.round(parseInt(c.slice(i, i + 2), 16) + (255 - parseInt(c.slice(i, i + 2), 16)) * amt)
    return Math.min(255, v).toString(16).padStart(2, '0')
  }).join('')
}

function PencilEditIcon({ size = 15, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M13.5 3.5l3 3L7 16H4v-3L13.5 3.5z" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  )
}

// ── Book Cover ─────────────────────────────────────────────────────────────
function BookCover({ color, size = 'md' }) {
  const dark = darken(color, 0.4)
  const mid = darken(color, 0.2)
  const light = lighten(color, 0.15)
  const h = size === 'lg' ? 160 : 130
  const w = size === 'lg' ? 122 : 100
  const spineW = size === 'lg' ? 13 : 11

  return (
    <div className={styles.bookWrap} style={{ width: w, height: h }}>
      <div className={styles.bookShadow} />
      <div className={styles.bookBack} style={{ background: dark }} />
      <div className={styles.bookPages} />
      <div className={styles.bookSpine} style={{ width: spineW, background: `linear-gradient(180deg, ${mid} 0%, ${dark} 100%)` }} />
      <div className={styles.bookFront} style={{ left: spineW, background: `linear-gradient(150deg, ${light} 0%, ${color} 40%, ${mid} 100%)` }}>
        <div className={styles.bookSheen} />
        <div className={styles.bookLines}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={styles.bookLine} style={{ opacity: 0.15 + i * 0.05 }} />
          ))}
        </div>
        <div className={styles.bindingDots}>
          {[0, 1, 2, 3, 4].map(i => <div key={i} className={styles.bindingDot} />)}
        </div>
      </div>
    </div>
  )
}

// ── New Notebook Modal ─────────────────────────────────────────────────────
function NewNotebookModal({ onConfirm, onClose }) {
  const [name, setName] = useState('My Notebook')
  const [color, setColor] = useState(COVER_COLORS[4])
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus(); inputRef.current?.select() }, [])

  function handleSubmit(e) {
    e.preventDefault()
    if (name.trim()) onConfirm(name.trim(), color)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <button className={styles.modalCancel} onClick={onClose}>Cancel</button>
          <h2 className={styles.modalTitle}>New Notebook</h2>
          <button className={styles.modalCreate} onClick={handleSubmit} disabled={!name.trim()}>
            Create
          </button>
        </div>

        <div className={styles.modalPreview}>
          <BookCover color={color} size="lg" />
          <div className={styles.previewName}>{name || 'Untitled'}</div>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Title</label>
            <input
              ref={inputRef}
              className={styles.fieldInput}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Notebook name"
              maxLength={60}
              onKeyDown={e => { if (e.key === 'Enter') handleSubmit(e) }}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Cover Color</label>
            <div className={styles.colorGrid}>
              {COVER_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`${styles.colorDot} ${color === c ? styles.colorDotActive : ''}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Notebook Card ──────────────────────────────────────────────────────────
function NotebookCard({ notebook, onClick, onRename, onDelete }) {
  const [showMenu, setShowMenu] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [renameVal, setRenameVal] = useState(notebook.name)
  const menuRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!showMenu) return
    function close(e) { if (!menuRef.current?.contains(e.target)) setShowMenu(false) }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [showMenu])

  useEffect(() => {
    if (renaming) { inputRef.current?.focus(); inputRef.current?.select() }
  }, [renaming])

  function commitRename() {
    if (renameVal.trim()) onRename(notebook.id, renameVal.trim())
    setRenaming(false)
  }

  const pageCount = notebook.pages?.length ?? 0

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.cardGlow} style={{ background: `radial-gradient(ellipse at 50% 0%, ${notebook.coverColor}22 0%, transparent 70%)` }} />

      <div className={styles.cardCover}>
        <BookCover color={notebook.coverColor} />
      </div>

      <div className={styles.cardBody}>
        {renaming ? (
          <input
            ref={inputRef}
            className={styles.renameInput}
            value={renameVal}
            onChange={e => setRenameVal(e.target.value)}
            onBlur={commitRename}
            onKeyDown={e => {
              if (e.key === 'Enter') commitRename()
              if (e.key === 'Escape') setRenaming(false)
            }}
            onClick={e => e.stopPropagation()}
            maxLength={60}
          />
        ) : (
          <span className={styles.cardName}>{notebook.name}</span>
        )}
        <div className={styles.cardMeta}>
          <div className={styles.colorChip} style={{ background: notebook.coverColor }} />
          {pageCount} {pageCount === 1 ? 'page' : 'pages'}
        </div>
      </div>

      <button
        className={styles.moreBtn}
        onClick={e => { e.stopPropagation(); setShowMenu(p => !p) }}
      >
        <DotsIcon size={14} color="var(--text-tertiary)" />
      </button>

      {showMenu && (
        <div ref={menuRef} className={styles.contextMenu} onClick={e => e.stopPropagation()}>
          <button
            className={styles.menuItem}
            onClick={e => { e.stopPropagation(); setShowMenu(false); setRenameVal(notebook.name); setRenaming(true) }}
          >
            <PencilEditIcon size={13} color="var(--text-primary)" /> Rename
          </button>
          <div className={styles.menuSep} />
          <button
            className={`${styles.menuItem} ${styles.menuItemDanger}`}
            onClick={e => { e.stopPropagation(); setShowMenu(false); onDelete(notebook.id) }}
          >
            <TrashIcon size={13} color="var(--red)" /> Delete
          </button>
        </div>
      )}
    </div>
  )
}

// ── HomeScreen ─────────────────────────────────────────────────────────────
export default function HomeScreen({ notebooks, onOpenNotebook, onAddNotebook, onRenameNotebook, onDeleteNotebook }) {
  const [showNew, setShowNew] = useState(false)
  const [search, setSearch] = useState('')
  const filtered = notebooks.filter(n => n.name.toLowerCase().includes(search.toLowerCase()))

  function handleCreate(name, color) {
    onAddNotebook(name, color)
    setShowNew(false)
  }

  return (
    <div className={styles.screen}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logoMark}>
            <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="7" fill="var(--accent)"/>
              <rect x="6" y="5" width="16" height="18" rx="2" fill="white" fillOpacity="0.9"/>
              <rect x="4" y="5" width="4" height="18" rx="2" fill="white" fillOpacity="0.45"/>
              <rect x="9" y="9" width="9" height="1.5" rx="0.75" fill="var(--accent)" fillOpacity="0.7"/>
              <rect x="9" y="12.5" width="6" height="1.5" rx="0.75" fill="var(--accent)" fillOpacity="0.5"/>
              <rect x="9" y="16" width="8" height="1.5" rx="0.75" fill="var(--accent)" fillOpacity="0.35"/>
            </svg>
          </div>
          <span className={styles.appName}>Note Taker</span>
        </div>

        <div className={styles.headerCenter}>
          <div className={styles.searchBox}>
            <SearchIcon size={14} color="var(--text-tertiary)" />
            <input
              className={styles.searchInput}
              placeholder="Search notebooks…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.headerRight}>
          <button className={styles.newBtn} onClick={() => setShowNew(true)}>
            <PlusIcon size={16} color="white" />
            <span>New Notebook</span>
          </button>
        </div>
      </div>

      {/* ── Section title ── */}
      <div className={styles.sectionBar}>
        <h1 className={styles.sectionTitle}>
          {search ? `Results for "${search}"` : 'All Notebooks'}
        </h1>
        <span className={styles.sectionCount}>{filtered.length}</span>
      </div>

      {/* ── Grid ── */}
      <div className={styles.content}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <NotebookIcon size={44} color="var(--text-tertiary)" />
            </div>
            <p className={styles.emptyTitle}>{search ? 'No results' : 'No Notebooks Yet'}</p>
            <p className={styles.emptyDesc}>{search ? 'Try a different search' : 'Create your first notebook to get started'}</p>
            {!search && (
              <button className={styles.emptyBtn} onClick={() => setShowNew(true)}>
                <PlusIcon size={15} color="white" /> Create Notebook
              </button>
            )}
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map(nb => (
              <NotebookCard
                key={nb.id}
                notebook={nb}
                onClick={() => onOpenNotebook(nb.id)}
                onRename={onRenameNotebook}
                onDelete={onDeleteNotebook}
              />
            ))}
            <div className={styles.addCard} onClick={() => setShowNew(true)}>
              <div className={styles.addCardInner}>
                <div className={styles.addCardIcon}>
                  <PlusIcon size={24} color="var(--accent)" />
                </div>
                <span className={styles.addCardLabel}>New Notebook</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {showNew && <NewNotebookModal onConfirm={handleCreate} onClose={() => setShowNew(false)} />}
    </div>
  )
}
