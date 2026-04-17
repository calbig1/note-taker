import { useState, useRef, useEffect } from 'react'
import styles from './HomeScreen.module.css'
import {
  SearchIcon, PlusIcon, TrashIcon, DotsIcon, NotebookIcon,
  StarIcon, StarFilledIcon, ClockIcon, ZapIcon, GridIcon,
  SunIcon, MoonIcon, ImageIcon,
} from './ToolIcons'

const COVER_COLORS = [
  '#E84040', '#FF6B35', '#FF9F1C', '#FBBF24',
  '#34D399', '#2EC4B6', '#38BDF8', '#6366F1',
  '#8B5CF6', '#EC4899', '#F43F5E', '#64748B',
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
  const dark = darken(color, 0.38)
  const mid = darken(color, 0.18)
  const light = lighten(color, 0.18)
  const h = size === 'lg' ? 168 : size === 'sm' ? 90 : 130
  const w = size === 'lg' ? 128 : size === 'sm' ? 70 : 100
  const spineW = size === 'lg' ? 14 : size === 'sm' ? 8 : 11

  return (
    <div className={styles.bookWrap} style={{ width: w, height: h }}>
      <div className={styles.bookShadow} />
      <div className={styles.bookBack} style={{ background: dark }} />
      <div className={styles.bookPages} />
      <div className={styles.bookSpine} style={{ width: spineW, background: `linear-gradient(180deg, ${mid} 0%, ${dark} 100%)` }} />
      <div className={styles.bookFront} style={{ left: spineW, background: `linear-gradient(150deg, ${light} 0%, ${color} 45%, ${mid} 100%)` }}>
        <div className={styles.bookSheen} />
        <div className={styles.bookLines}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={styles.bookLine} style={{ opacity: 0.12 + i * 0.04 }} />
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
  const [color, setColor] = useState(COVER_COLORS[7])
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
function NotebookCard({ notebook, onClick, onRename, onDelete, onToggleFavorite, isFavorite }) {
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
      <div className={styles.cardAccent} style={{ background: notebook.coverColor }} />

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
          <span className={styles.cardPageCount}>{pageCount} {pageCount === 1 ? 'page' : 'pages'}</span>
        </div>
      </div>

      {/* Favorite star */}
      <button
        className={`${styles.starBtn} ${isFavorite ? styles.starBtnActive : ''}`}
        onClick={e => { e.stopPropagation(); onToggleFavorite(notebook.id) }}
        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorite
          ? <StarFilledIcon size={14} color="#FBBF24" />
          : <StarIcon size={14} color="var(--text-tertiary)" />}
      </button>

      <button
        className={styles.moreBtn}
        onClick={e => { e.stopPropagation(); setShowMenu(p => !p) }}
      >
        <DotsIcon size={15} color="var(--text-tertiary)" />
      </button>

      {showMenu && (
        <div ref={menuRef} className={styles.contextMenu} onClick={e => e.stopPropagation()}>
          <button
            className={styles.menuItem}
            onClick={e => { e.stopPropagation(); setShowMenu(false); setRenameVal(notebook.name); setRenaming(true) }}
          >
            <PencilEditIcon size={13} color="var(--text-primary)" /> Rename
          </button>
          <button
            className={styles.menuItem}
            onClick={e => { e.stopPropagation(); setShowMenu(false); onToggleFavorite(notebook.id) }}
          >
            <StarIcon size={13} color="var(--text-primary)" /> {isFavorite ? 'Unfavorite' : 'Favorite'}
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

// ── Compact Row Card (for Recent tab) ────────────────────────────────────
function NotebookRow({ notebook, onClick, onToggleFavorite, isFavorite, lastOpenedLabel }) {
  return (
    <div className={styles.rowCard} onClick={onClick}>
      <BookCover color={notebook.coverColor} size="sm" />
      <div className={styles.rowBody}>
        <span className={styles.rowName}>{notebook.name}</span>
        <span className={styles.rowMeta}>
          {notebook.pages?.length ?? 0} pages
          {lastOpenedLabel && <> · {lastOpenedLabel}</>}
        </span>
      </div>
      <button
        className={`${styles.rowStarBtn} ${isFavorite ? styles.starBtnActive : ''}`}
        onClick={e => { e.stopPropagation(); onToggleFavorite(notebook.id) }}
      >
        {isFavorite
          ? <StarFilledIcon size={16} color="#FBBF24" />
          : <StarIcon size={16} color="var(--text-tertiary)" />}
      </button>
      <ChevronRightMini />
    </div>
  )
}

function ChevronRightMini() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <path d="M9 18L15 12L9 6" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function formatRelativeTime(ts) {
  if (!ts) return ''
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(ts).toLocaleDateString()
}

const TABS = [
  { id: 'all',       label: 'All',        Icon: GridIcon },
  { id: 'recent',    label: 'Recent',     Icon: ClockIcon },
  { id: 'favorites', label: 'Favorites',  Icon: StarIcon },
  { id: 'quicknotes',label: 'Quick Notes',Icon: ZapIcon },
]

// ── Quick Note card ────────────────────────────────────────────────────────
function QuickNoteCard({ notebook, onClick }) {
  const lastPage = notebook?.pages?.[notebook.pages.length - 1]
  return (
    <div className={styles.quickCard} onClick={onClick}>
      <div className={styles.quickIcon} style={{ background: notebook?.coverColor + '22', border: `1.5px solid ${notebook?.coverColor}44` }}>
        <ZapIcon size={22} color={notebook?.coverColor ?? 'var(--accent)'} />
      </div>
      <div className={styles.quickBody}>
        <span className={styles.quickName}>{notebook?.name ?? 'Quick Notes'}</span>
        <span className={styles.quickMeta}>{notebook?.pages?.length ?? 0} pages · tap to continue</span>
      </div>
      <div className={styles.quickArrow}>
        <ChevronRightMini />
      </div>
    </div>
  )
}

// ── HomeScreen ─────────────────────────────────────────────────────────────
export default function HomeScreen({
  notebooks, onOpenNotebook, onAddNotebook, onRenameNotebook, onDeleteNotebook,
  favorites, onToggleFavorite, recentNotebooks, darkMode, onToggleDarkMode,
}) {
  const [showNew, setShowNew] = useState(false)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  function handleCreate(name, color) {
    onAddNotebook(name, color)
    setShowNew(false)
  }

  // Derive tab content
  const favoriteNotebooks = notebooks.filter(n => favorites.includes(n.id))
  const recentList = recentNotebooks
    .map(r => ({ notebook: notebooks.find(n => n.id === r.id), openedAt: r.openedAt }))
    .filter(r => r.notebook)

  const quickNotesNb = notebooks.find(n => n.isQuickNotes)

  const searchFiltered = search
    ? notebooks.filter(n => n.name.toLowerCase().includes(search.toLowerCase()))
    : null

  function handleNewQuickNotes() {
    onAddNotebook('Quick Notes', '#6366F1', true)
  }

  return (
    <div className={`${styles.screen} ${darkMode ? styles.dark : styles.light}`}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logoMark}>
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="var(--accent)"/>
              <rect x="6" y="5" width="16" height="18" rx="2.5" fill="white" fillOpacity="0.92"/>
              <rect x="4" y="5" width="5" height="18" rx="2.5" fill="white" fillOpacity="0.5"/>
              <rect x="9" y="9" width="9" height="1.5" rx="0.75" fill="var(--accent)" fillOpacity="0.6"/>
              <rect x="9" y="12.5" width="6" height="1.5" rx="0.75" fill="var(--accent)" fillOpacity="0.45"/>
              <rect x="9" y="16" width="8" height="1.5" rx="0.75" fill="var(--accent)" fillOpacity="0.3"/>
            </svg>
          </div>
          <span className={styles.appName}>Note Taker</span>
        </div>

        <div className={styles.headerCenter}>
          <div className={styles.searchBox}>
            <SearchIcon size={15} color="var(--hs-text3)" />
            <input
              className={styles.searchInput}
              placeholder="Search notebooks…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className={styles.searchClear} onClick={() => setSearch('')}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="7" fill="var(--hs-text3)" opacity="0.4"/>
                  <line x1="4.5" y1="4.5" x2="9.5" y2="9.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="9.5" y1="4.5" x2="4.5" y2="9.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className={styles.headerRight}>
          <button className={styles.themeBtn} onClick={onToggleDarkMode} title="Toggle theme">
            {darkMode ? <SunIcon size={18} color="var(--hs-text2)" /> : <MoonIcon size={18} color="var(--hs-text2)" />}
          </button>
          <button className={styles.newBtn} onClick={() => setShowNew(true)}>
            <PlusIcon size={15} color="white" />
            <span>New Notebook</span>
          </button>
        </div>
      </div>

      {/* ── Search results override ── */}
      {searchFiltered ? (
        <div className={styles.body}>
          <div className={styles.sectionBar}>
            <h2 className={styles.sectionTitle}>Results for "{search}"</h2>
            <span className={styles.sectionCount}>{searchFiltered.length}</span>
          </div>
          <div className={styles.grid}>
            {searchFiltered.map(nb => (
              <NotebookCard
                key={nb.id}
                notebook={nb}
                onClick={() => onOpenNotebook(nb.id)}
                onRename={onRenameNotebook}
                onDelete={onDeleteNotebook}
                onToggleFavorite={onToggleFavorite}
                isFavorite={favorites.includes(nb.id)}
              />
            ))}
            {searchFiltered.length === 0 && (
              <div className={styles.empty}>
                <NotebookIcon size={44} color="var(--hs-text3)" />
                <p className={styles.emptyTitle}>No notebooks found</p>
                <p className={styles.emptyDesc}>Try a different search term</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* ── Tab Bar ── */}
          <div className={styles.tabBar}>
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                className={`${styles.tab} ${activeTab === id ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(id)}
              >
                <Icon size={16} color={activeTab === id ? 'var(--accent)' : 'var(--hs-text2)'} />
                <span>{label}</span>
                {id === 'favorites' && favoriteNotebooks.length > 0 && (
                  <span className={styles.tabBadge}>{favoriteNotebooks.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* ── Tab Content ── */}
          <div className={styles.body}>
            {/* ALL tab */}
            {activeTab === 'all' && (
              <>
                <div className={styles.sectionBar}>
                  <h2 className={styles.sectionTitle}>All Notebooks</h2>
                  <span className={styles.sectionCount}>{notebooks.length}</span>
                </div>
                {notebooks.length === 0 ? (
                  <div className={styles.empty}>
                    <div className={styles.emptyIllustration}>
                      <NotebookIcon size={52} color="var(--hs-text3)" />
                    </div>
                    <p className={styles.emptyTitle}>No Notebooks Yet</p>
                    <p className={styles.emptyDesc}>Create your first notebook to start writing</p>
                    <button className={styles.emptyBtn} onClick={() => setShowNew(true)}>
                      <PlusIcon size={15} color="white" /> Create Notebook
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
                        onToggleFavorite={onToggleFavorite}
                        isFavorite={favorites.includes(nb.id)}
                      />
                    ))}
                    <div className={styles.addCard} onClick={() => setShowNew(true)}>
                      <div className={styles.addCardInner}>
                        <div className={styles.addCardIcon}>
                          <PlusIcon size={26} color="var(--accent)" />
                        </div>
                        <span className={styles.addCardLabel}>New Notebook</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* RECENT tab */}
            {activeTab === 'recent' && (
              <>
                <div className={styles.sectionBar}>
                  <h2 className={styles.sectionTitle}>Recently Opened</h2>
                  <span className={styles.sectionCount}>{recentList.length}</span>
                </div>
                {recentList.length === 0 ? (
                  <div className={styles.empty}>
                    <ClockIcon size={48} color="var(--hs-text3)" />
                    <p className={styles.emptyTitle}>No Recent Notebooks</p>
                    <p className={styles.emptyDesc}>Notebooks you open will appear here</p>
                  </div>
                ) : (
                  <div className={styles.rowList}>
                    {recentList.map(({ notebook, openedAt }) => (
                      <NotebookRow
                        key={notebook.id}
                        notebook={notebook}
                        onClick={() => onOpenNotebook(notebook.id)}
                        onToggleFavorite={onToggleFavorite}
                        isFavorite={favorites.includes(notebook.id)}
                        lastOpenedLabel={formatRelativeTime(openedAt)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* FAVORITES tab */}
            {activeTab === 'favorites' && (
              <>
                <div className={styles.sectionBar}>
                  <h2 className={styles.sectionTitle}>Favorites</h2>
                  <span className={styles.sectionCount}>{favoriteNotebooks.length}</span>
                </div>
                {favoriteNotebooks.length === 0 ? (
                  <div className={styles.empty}>
                    <StarIcon size={48} color="var(--hs-text3)" />
                    <p className={styles.emptyTitle}>No Favorites Yet</p>
                    <p className={styles.emptyDesc}>Tap the ★ on any notebook to favorite it</p>
                  </div>
                ) : (
                  <div className={styles.grid}>
                    {favoriteNotebooks.map(nb => (
                      <NotebookCard
                        key={nb.id}
                        notebook={nb}
                        onClick={() => onOpenNotebook(nb.id)}
                        onRename={onRenameNotebook}
                        onDelete={onDeleteNotebook}
                        onToggleFavorite={onToggleFavorite}
                        isFavorite={true}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* QUICK NOTES tab */}
            {activeTab === 'quicknotes' && (
              <>
                <div className={styles.sectionBar}>
                  <h2 className={styles.sectionTitle}>Quick Notes</h2>
                </div>
                <div className={styles.quickSection}>
                  <div className={styles.quickHero}>
                    <div className={styles.quickHeroIcon}>
                      <ZapIcon size={32} color="var(--accent)" />
                    </div>
                    <div className={styles.quickHeroText}>
                      <h3 className={styles.quickHeroTitle}>Capture Ideas Fast</h3>
                      <p className={styles.quickHeroDesc}>Quick Notes let you jump straight to writing without choosing a notebook first.</p>
                    </div>
                  </div>

                  {quickNotesNb ? (
                    <>
                      <div className={styles.quickLabel}>Your Quick Notes Notebook</div>
                      <QuickNoteCard
                        notebook={quickNotesNb}
                        onClick={() => onOpenNotebook(quickNotesNb.id)}
                      />
                    </>
                  ) : (
                    <button className={styles.quickCreateBtn} onClick={handleNewQuickNotes}>
                      <PlusIcon size={18} color="white" />
                      Create Quick Notes Notebook
                    </button>
                  )}

                  <div className={styles.quickLabel} style={{ marginTop: 28 }}>All Notebooks</div>
                  <div className={styles.rowList}>
                    {notebooks.filter(n => !n.isQuickNotes).slice(0, 5).map(nb => (
                      <NotebookRow
                        key={nb.id}
                        notebook={nb}
                        onClick={() => onOpenNotebook(nb.id)}
                        onToggleFavorite={onToggleFavorite}
                        isFavorite={favorites.includes(nb.id)}
                      />
                    ))}
                    {notebooks.filter(n => !n.isQuickNotes).length > 5 && (
                      <button className={styles.viewAllBtn} onClick={() => setActiveTab('all')}>
                        View all {notebooks.length} notebooks →
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {showNew && <NewNotebookModal onConfirm={handleCreate} onClose={() => setShowNew(false)} />}
    </div>
  )
}
