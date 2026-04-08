import { useRef, useEffect, useState } from 'react'
import { drawPaper } from '../utils/drawPaper'
import { renderAllStrokes, renderTextElements } from '../utils/drawStrokes'
import { BackIcon, PlusIcon, DotsIcon, TrashIcon, PageIcon } from './ToolIcons'
import styles from './NotebookView.module.css'

const THUMB_W = 180
const THUMB_H = 240

function getOrigSize(page) {
  if (page.paperType === 'whiteboard') return { w: 2400, h: 1600 }
  return { w: 850, h: 1100 }
}

// ── Page Thumbnail ─────────────────────────────────────────────────────────────
function PageThumbnail({ page }) {
  const canvasRef = useRef(null)
  const { w: ORIG_W, h: ORIG_H } = getOrigSize(page)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const scale = Math.min(THUMB_W / ORIG_W, THUMB_H / ORIG_H)
    ctx.clearRect(0, 0, THUMB_W, THUMB_H)
    ctx.save()
    ctx.scale(scale, scale)
    drawPaper(ctx, page, ORIG_W, ORIG_H)
    renderAllStrokes(ctx, page.strokes)
    renderTextElements(ctx, page.textElements)
    ctx.restore()
  }, [page.id, page.strokes, page.textElements, page.paperType, page.paperColor, page.lineSpacing])

  return (
    <canvas
      ref={canvasRef}
      width={THUMB_W}
      height={THUMB_H}
      className={styles.thumbCanvas}
    />
  )
}

// ── Page Card ──────────────────────────────────────────────────────────────────
function PageCard({ page, notebookId, index, onClick, onRename, onDelete, onDuplicate }) {
  const [showMenu, setShowMenu] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState(page.name)
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
    setRenameValue(page.name)
    setRenaming(true)
  }

  function handleRenameSubmit() {
    if (renameValue.trim()) onRename(notebookId, page.id, renameValue.trim())
    setRenaming(false)
  }

  function handleRenameKey(e) {
    if (e.key === 'Enter') handleRenameSubmit()
    if (e.key === 'Escape') setRenaming(false)
  }

  function handleDoubleClick(e) {
    e.stopPropagation()
    setRenameValue(page.name)
    setRenaming(true)
  }

  function handleDeleteClick(e) {
    e.stopPropagation()
    setShowMenu(false)
    onDelete(notebookId, page.id)
  }

  function handleDuplicateClick(e) {
    e.stopPropagation()
    setShowMenu(false)
    onDuplicate(notebookId, page.id)
  }

  return (
    <div className={styles.pageCard} onClick={onClick}>
      {/* Thumbnail */}
      <div className={styles.thumbWrapper}>
        <PageThumbnail page={page} />
        <div className={styles.thumbOverlay} />
        <div className={styles.pageNumber}>{index + 1}</div>
      </div>

      {/* Footer */}
      <div className={styles.pageFooter}>
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
          <span
            className={styles.pageName}
            onDoubleClick={handleDoubleClick}
          >
            {page.name}
          </span>
        )}

        <button
          className={styles.menuBtn}
          onClick={handleMenuClick}
          title="More options"
        >
          <DotsIcon size={14} color="var(--gray-500)" />
        </button>
      </div>

      {showMenu && (
        <div ref={menuRef} className={styles.contextMenu} onClick={e => e.stopPropagation()}>
          <button className={styles.menuItem} onClick={handleRenameClick}>Rename</button>
          <button className={styles.menuItem} onClick={handleDuplicateClick}>Duplicate</button>
          <div className={styles.menuDivider} />
          <button className={`${styles.menuItem} ${styles.menuItemDanger}`} onClick={handleDeleteClick}>
            <TrashIcon size={13} color="currentColor" />
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

// ── NotebookView ───────────────────────────────────────────────────────────────
export default function NotebookView({
  notebook,
  onBack,
  onOpenPage,
  onAddPage,
  onRenamePage,
  onDeletePage,
  onDuplicatePage,
}) {
  if (!notebook) return null
  const pages = notebook.pages ?? []

  return (
    <div className={styles.screen}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <button className={styles.backBtn} onClick={onBack} title="Back to library">
            <BackIcon size={20} color="var(--blue-primary)" />
          </button>
          <div className={styles.notebookInfo}>
            <span className={styles.notebookName}>{notebook.name}</span>
            <span className={styles.pageCount}>
              {pages.length} {pages.length === 1 ? 'page' : 'pages'}
            </span>
          </div>
        </div>
        <button className={styles.addPageBtn} onClick={() => onAddPage(notebook.id)}>
          <PlusIcon size={16} color="white" />
          Add Page
        </button>
      </div>

      {/* Page grid */}
      <div className={styles.content}>
        {pages.length === 0 ? (
          <div className={styles.emptyState}>
            <PageIcon size={56} color="var(--gray-300)" />
            <h2 className={styles.emptyTitle}>No pages yet</h2>
            <button className={styles.emptyBtn} onClick={() => onAddPage(notebook.id)}>
              <PlusIcon size={16} color="white" />
              Add Page
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {pages.map((page, i) => (
              <PageCard
                key={page.id}
                page={page}
                notebookId={notebook.id}
                index={i}
                onClick={() => onOpenPage(notebook.id, page.id)}
                onRename={onRenamePage}
                onDelete={onDeletePage}
                onDuplicate={onDuplicatePage}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
