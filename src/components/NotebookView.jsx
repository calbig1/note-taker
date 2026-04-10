import { useRef, useEffect, useState } from 'react'
import { drawPaper } from '../utils/drawPaper'
import { renderAllStrokes, renderTextElements } from '../utils/drawStrokes'
import styles from './NotebookView.module.css'
import { BackIcon, PlusIcon, DotsIcon, TrashIcon, PageIcon } from './ToolIcons'

const THUMB_W = 180
const THUMB_H = 240

function getOrigSize(page) {
  if (page.paperType === 'whiteboard') return { w: 2400, h: 1600 }
  return { w: 850, h: 1100 }
}

function CopyIcon({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect x="7" y="7" width="10" height="10" rx="2" stroke={color} strokeWidth="1.6"/>
      <path d="M13 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}

function PencilEditIcon({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M13.5 3.5l3 3L7 16H4v-3L13.5 3.5z" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  )
}

// ── Page Thumbnail ─────────────────────────────────────────────────────────
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

// ── Page Card ──────────────────────────────────────────────────────────────
function PageCard({ page, notebookId, index, onClick, onRename, onDelete, onDuplicate }) {
  const [showMenu, setShowMenu] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState(page.name)
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
    if (renameValue.trim()) onRename(notebookId, page.id, renameValue.trim())
    setRenaming(false)
  }

  return (
    <div className={styles.pageCard} onClick={onClick}>
      <div className={styles.thumbWrapper}>
        <PageThumbnail page={page} />
        <div className={styles.pageNumBadge}>{index + 1}</div>
      </div>

      <div className={styles.pageFooter}>
        {renaming ? (
          <input
            ref={inputRef}
            className={styles.renameInput}
            value={renameValue}
            onChange={e => setRenameValue(e.target.value)}
            onBlur={commitRename}
            onKeyDown={e => {
              if (e.key === 'Enter') commitRename()
              if (e.key === 'Escape') setRenaming(false)
            }}
            onClick={e => e.stopPropagation()}
            maxLength={60}
          />
        ) : (
          <span
            className={styles.pageName}
            onDoubleClick={e => { e.stopPropagation(); setRenameValue(page.name); setRenaming(true) }}
          >
            {page.name}
          </span>
        )}

        <button
          className={styles.menuBtn}
          onClick={e => { e.stopPropagation(); setShowMenu(p => !p) }}
        >
          <DotsIcon size={13} color="var(--text-secondary, #636366)" />
        </button>
      </div>

      {showMenu && (
        <div ref={menuRef} className={styles.contextMenu} onClick={e => e.stopPropagation()}>
          <button
            className={styles.menuItem}
            onClick={e => { e.stopPropagation(); setShowMenu(false); setRenameValue(page.name); setRenaming(true) }}
          >
            <PencilEditIcon size={13} color="var(--text-primary, #1C1C1E)" /> Rename
          </button>
          <button
            className={styles.menuItem}
            onClick={e => { e.stopPropagation(); setShowMenu(false); onDuplicate(notebookId, page.id) }}
          >
            <CopyIcon size={13} color="var(--text-primary, #1C1C1E)" /> Duplicate
          </button>
          <div className={styles.menuDivider} />
          <button
            className={`${styles.menuItem} ${styles.menuItemDanger}`}
            onClick={e => { e.stopPropagation(); setShowMenu(false); onDelete(notebookId, page.id) }}
          >
            <TrashIcon size={13} color="var(--red, #FF3B30)" /> Delete
          </button>
        </div>
      )}
    </div>
  )
}

// ── NotebookView ───────────────────────────────────────────────────────────
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
      {/* Dark top bar */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={onBack}>
          <BackIcon size={20} color="#FFFFFF" />
          <span className={styles.backLabel}>Notebooks</span>
        </button>

        <div className={styles.topBarCenter}>
          <span className={styles.notebookName}>{notebook.name}</span>
          <span className={styles.pageCount}>
            {pages.length} {pages.length === 1 ? 'page' : 'pages'}
          </span>
        </div>

        <button className={styles.addPageBtn} onClick={() => onAddPage(notebook.id)}>
          <PlusIcon size={15} color="white" />
          <span>Add Page</span>
        </button>
      </div>

      {/* Page grid */}
      <div className={styles.content}>
        {pages.length === 0 ? (
          <div className={styles.empty}>
            <PageIcon size={52} color="#AEAEB2" />
            <p className={styles.emptyTitle}>No pages yet</p>
            <button className={styles.emptyAddBtn} onClick={() => onAddPage(notebook.id)}>
              <PlusIcon size={14} color="white" /> Add Page
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
            <div className={styles.addCard} onClick={() => onAddPage(notebook.id)}>
              <div className={styles.addCardIcon}>
                <PlusIcon size={26} color="var(--blue, #007AFF)" />
              </div>
              <span className={styles.addCardLabel}>New Page</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
