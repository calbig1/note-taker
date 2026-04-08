import { useState, useRef, useEffect } from 'react'
import { PlusIcon, NotebookIcon, DotsIcon, TrashIcon } from './ToolIcons'
import styles from './HomeScreen.module.css'

const COVER_COLORS = [
  '#2563EB', '#1E40AF', '#0891B2', '#0D9488',
  '#16A34A', '#CA8A04', '#EA580C', '#DC2626',
  '#9333EA', '#DB2777', '#475569', '#0F172A',
]

function darken(hex, amount = 0.25) {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  const [r, g, b] = rgb.map(c => Math.round(c * (1 - amount)))
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return null
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ]
}

// ── New Notebook Modal ─────────────────────────────────────────────────────────
function NewNotebookModal({ onConfirm, onClose }) {
  const [name, setName] = useState('My Notebook')
  const [selectedColor, setSelectedColor] = useState(COVER_COLORS[0])
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    if (name.trim()) onConfirm(name.trim(), selectedColor)
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>New Notebook</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Name</label>
            <input
              ref={inputRef}
              className={styles.formInput}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Notebook name"
              maxLength={60}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Cover Color</label>
            <div className={styles.colorPicker}>
              {COVER_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`${styles.coverColorBtn} ${selectedColor === c ? styles.coverColorBtnActive : ''}`}
                  style={{ background: c }}
                  onClick={() => setSelectedColor(c)}
                />
              ))}
            </div>
          </div>

          {/* Cover preview */}
          <div className={styles.previewRow}>
            <div
              className={styles.coverPreview}
              style={{ background: `linear-gradient(135deg, ${selectedColor} 0%, ${darken(selectedColor)} 100%)` }}
            >
              <NotebookIcon size={28} color="rgba(255,255,255,0.8)" />
            </div>
            <div className={styles.previewInfo}>
              <div className={styles.previewName}>{name || 'Untitled'}</div>
              <div className={styles.previewMeta}>1 page</div>
            </div>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.createBtn} disabled={!name.trim()}>
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Notebook Card ──────────────────────────────────────────────────────────────
function NotebookCard({ notebook, onClick, onRename, onDelete }) {
  const [showMenu, setShowMenu] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState(notebook.name)
  const menuRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!showMenu) return
    function handleClick(e) {
      if (!menuRef.current?.contains(e.target)) setShowMenu(false)
    }
    document.addEventListener('pointerdown', handleClick)
    return () => document.removeEventListener('pointerdown', handleClick)
  }, [showMenu])

  useEffect(() => {
    if (renaming) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [renaming])

  function handleMenuClick(e) {
    e.stopPropagation()
    setShowMenu(prev => !prev)
  }

  function handleRenameClick(e) {
    e.stopPropagation()
    setShowMenu(false)
    setRenameValue(notebook.name)
    setRenaming(true)
  }

  function handleRenameSubmit() {
    if (renameValue.trim()) onRename(notebook.id, renameValue.trim())
    setRenaming(false)
  }

  function handleRenameKey(e) {
    if (e.key === 'Enter') handleRenameSubmit()
    if (e.key === 'Escape') setRenaming(false)
  }

  function handleDeleteClick(e) {
    e.stopPropagation()
    setShowMenu(false)
    onDelete(notebook.id)
  }

  const pageCount = notebook.pages?.length ?? 0

  return (
    <div className={styles.card} onClick={onClick}>
      {/* Cover */}
      <div
        className={styles.cardCover}
        style={{
          background: `linear-gradient(145deg, ${notebook.coverColor} 0%, ${darken(notebook.coverColor, 0.3)} 100%)`,
        }}
      >
        <NotebookIcon size={36} color="rgba(255,255,255,0.55)" />
        {/* Spine accent */}
        <div className={styles.cardSpine} style={{ background: darken(notebook.coverColor, 0.4) }} />
      </div>

      {/* Footer */}
      <div className={styles.cardFooter}>
        {renaming ? (
          <input
            ref={inputRef}
            className={styles.renameInput}
            value={renameValue}
            onChange={e => setRenameValue(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={handleRenameKey}
            onClick={e => e.stopPropagation()}
            maxLength={60}
          />
        ) : (
          <span className={styles.cardName}>{notebook.name}</span>
        )}
        <span className={styles.cardMeta}>{pageCount} {pageCount === 1 ? 'page' : 'pages'}</span>
      </div>

      {/* Context menu button */}
      <button
        className={styles.menuBtn}
        onClick={handleMenuClick}
        title="More options"
      >
        <DotsIcon size={16} color="var(--gray-500)" />
      </button>

      {showMenu && (
        <div ref={menuRef} className={styles.contextMenu} onClick={e => e.stopPropagation()}>
          <button className={styles.menuItem} onClick={handleRenameClick}>
            Rename
          </button>
          <button className={`${styles.menuItem} ${styles.menuItemDanger}`} onClick={handleDeleteClick}>
            <TrashIcon size={14} color="currentColor" />
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

// ── HomeScreen ─────────────────────────────────────────────────────────────────
export default function HomeScreen({
  notebooks,
  onOpenNotebook,
  onAddNotebook,
  onRenameNotebook,
  onDeleteNotebook,
}) {
  const [showNewModal, setShowNewModal] = useState(false)

  function handleCreate(name, coverColor) {
    onAddNotebook(name, coverColor)
    setShowNewModal(false)
  }

  return (
    <div className={styles.screen}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <NotebookIcon size={22} color="var(--blue-primary)" />
          <h1 className={styles.title}>My Library</h1>
        </div>
        <button className={styles.newBtn} onClick={() => setShowNewModal(true)}>
          <PlusIcon size={16} color="white" />
          New Notebook
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {notebooks.length === 0 ? (
          <div className={styles.emptyState}>
            <NotebookIcon size={64} color="var(--gray-300)" />
            <h2 className={styles.emptyTitle}>No notebooks yet</h2>
            <p className={styles.emptyDesc}>Create your first notebook to get started</p>
            <button className={styles.emptyBtn} onClick={() => setShowNewModal(true)}>
              <PlusIcon size={16} color="white" />
              Create Notebook
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {notebooks.map(nb => (
              <NotebookCard
                key={nb.id}
                notebook={nb}
                onClick={() => onOpenNotebook(nb.id)}
                onRename={onRenameNotebook}
                onDelete={onDeleteNotebook}
              />
            ))}
          </div>
        )}
      </div>

      {showNewModal && (
        <NewNotebookModal
          onConfirm={handleCreate}
          onClose={() => setShowNewModal(false)}
        />
      )}
    </div>
  )
}
