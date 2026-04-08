import { useState } from 'react'
import styles from './Sidebar.module.css'

const COVER_COLORS = [
  '#e74c3c', '#c0392b', '#e67e22', '#f39c12',
  '#27ae60', '#16a085', '#2980b9', '#8e44ad',
  '#2c3e50', '#7f8c8d', '#d4a574', '#6c3483',
]

export default function Sidebar({
  notebooks,
  activeNotebookId,
  activePageId,
  onSelectNotebook,
  onSelectPage,
  onAddNotebook,
  onRenameNotebook,
  onDeleteNotebook,
  onAddPage,
  onRenamePage,
  onDeletePage,
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [editingNotebookId, setEditingNotebookId] = useState(null)
  const [editingPageId, setEditingPageId] = useState(null)
  const [showNewNotebook, setShowNewNotebook] = useState(false)
  const [newNotebookName, setNewNotebookName] = useState('')
  const [newNotebookColor, setNewNotebookColor] = useState(COVER_COLORS[0])
  const [contextMenu, setContextMenu] = useState(null) // {type, id, x, y}

  const activeNotebook = notebooks.find(n => n.id === activeNotebookId)

  if (collapsed) {
    return (
      <div className={styles.collapsed}>
        <button className={styles.collapseBtn} onClick={() => setCollapsed(false)} title="Expand sidebar">▶</button>
      </div>
    )
  }

  function handleNotebookContext(e, nb) {
    e.preventDefault()
    setContextMenu({ type: 'notebook', id: nb.id, x: e.clientX, y: e.clientY })
  }

  function handlePageContext(e, pg) {
    e.preventDefault()
    setContextMenu({ type: 'page', id: pg.id, x: e.clientX, y: e.clientY })
  }

  function closeContext() { setContextMenu(null) }

  function commitNotebookRename(nb, newName) {
    if (newName.trim()) onRenameNotebook(nb.id, newName.trim())
    setEditingNotebookId(null)
  }

  function commitPageRename(pg, newName) {
    if (newName.trim()) onRenamePage(activeNotebookId, pg.id, newName.trim())
    setEditingPageId(null)
  }

  return (
    <div className={styles.sidebar} onClick={closeContext}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.headerTitle}>Notebooks</span>
        <button className={styles.collapseBtn} onClick={() => setCollapsed(true)} title="Collapse">◀</button>
      </div>

      {/* Notebook list */}
      <div className={styles.notebookList}>
        {notebooks.map(nb => (
          <div key={nb.id} className={styles.notebookEntry}>
            <button
              className={`${styles.notebookBtn} ${nb.id === activeNotebookId ? styles.notebookBtnActive : ''}`}
              onClick={() => onSelectNotebook(nb.id)}
              onContextMenu={e => handleNotebookContext(e, nb)}
            >
              <span className={styles.notebookIcon} style={{ background: nb.coverColor }}>📓</span>
              {editingNotebookId === nb.id ? (
                <input
                  className={styles.renameInput}
                  defaultValue={nb.name}
                  autoFocus
                  onBlur={e => commitNotebookRename(nb, e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') commitNotebookRename(nb, e.target.value)
                    if (e.key === 'Escape') setEditingNotebookId(null)
                  }}
                  onClick={e => e.stopPropagation()}
                />
              ) : (
                <span className={styles.notebookName}>{nb.name}</span>
              )}
            </button>

            {/* Pages list for active notebook */}
            {nb.id === activeNotebookId && (
              <div className={styles.pageList}>
                {nb.pages.map((pg, idx) => (
                  <button
                    key={pg.id}
                    className={`${styles.pageBtn} ${pg.id === activePageId ? styles.pageBtnActive : ''}`}
                    onClick={() => onSelectPage(pg.id)}
                    onContextMenu={e => handlePageContext(e, pg)}
                  >
                    <span className={styles.pageIcon}>{getPageIcon(pg.paperType)}</span>
                    {editingPageId === pg.id ? (
                      <input
                        className={styles.renameInput}
                        defaultValue={pg.name}
                        autoFocus
                        onBlur={e => commitPageRename(pg, e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') commitPageRename(pg, e.target.value)
                          if (e.key === 'Escape') setEditingPageId(null)
                        }}
                        onClick={e => e.stopPropagation()}
                      />
                    ) : (
                      <span className={styles.pageName}>{pg.name}</span>
                    )}
                  </button>
                ))}
                <button className={styles.addPageBtn} onClick={() => onAddPage(nb.id)}>
                  + Add page
                </button>
              </div>
            )}
          </div>
        ))}

        {/* New notebook form */}
        {showNewNotebook ? (
          <div className={styles.newNotebookForm}>
            <input
              className={styles.newNotebookInput}
              placeholder="Notebook name…"
              value={newNotebookName}
              onChange={e => setNewNotebookName(e.target.value)}
              autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  onAddNotebook(newNotebookName || 'New Notebook', newNotebookColor)
                  setNewNotebookName('')
                  setShowNewNotebook(false)
                }
                if (e.key === 'Escape') setShowNewNotebook(false)
              }}
            />
            <div className={styles.colorPicker}>
              {COVER_COLORS.map(c => (
                <button
                  key={c}
                  className={`${styles.coverSwatch} ${newNotebookColor === c ? styles.coverSwatchActive : ''}`}
                  style={{ background: c }}
                  onClick={() => setNewNotebookColor(c)}
                />
              ))}
            </div>
            <div className={styles.newNbActions}>
              <button className={styles.confirmBtn} onClick={() => {
                onAddNotebook(newNotebookName || 'New Notebook', newNotebookColor)
                setNewNotebookName('')
                setShowNewNotebook(false)
              }}>Create</button>
              <button className={styles.cancelBtn} onClick={() => setShowNewNotebook(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <button className={styles.addNotebookBtn} onClick={() => setShowNewNotebook(true)}>
            + New Notebook
          </button>
        )}
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          className={styles.contextMenu}
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={e => e.stopPropagation()}
        >
          {contextMenu.type === 'notebook' ? (
            <>
              <button onClick={() => { setEditingNotebookId(contextMenu.id); closeContext() }}>Rename</button>
              <button className={styles.deleteItem} onClick={() => { onDeleteNotebook(contextMenu.id); closeContext() }}>Delete</button>
            </>
          ) : (
            <>
              <button onClick={() => { setEditingPageId(contextMenu.id); closeContext() }}>Rename</button>
              <button className={styles.deleteItem} onClick={() => { onDeletePage(activeNotebookId, contextMenu.id); closeContext() }}>Delete</button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function getPageIcon(paperType) {
  switch (paperType) {
    case 'lined': return '📄'
    case 'unlined': return '⬜'
    case 'dotgrid': return '⋯'
    case 'whiteboard': return '🖼️'
    default: return '📄'
  }
}
