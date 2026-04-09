import { useState, useRef, useEffect } from 'react'
import ColorWheel from './ColorWheel'
import styles from './Toolbar.module.css'

const DRAW_TOOLS = [
  { id: 'ballpoint', label: 'Pen', icon: PenIcon },
  { id: 'fountain',  label: 'Fountain', icon: FountainIcon },
  { id: 'brush',     label: 'Brush', icon: BrushIcon },
  { id: 'pencil',    label: 'Pencil', icon: PencilDrawIcon },
  { id: 'highlighter', label: 'Highlighter', icon: HighlighterIcon },
  { id: 'eraser',    label: 'Eraser', icon: EraserIcon },
  { id: 'select',    label: 'Lasso', icon: LassoIcon },
  { id: 'shape',     label: 'Shape', icon: ShapeIcon },
  { id: 'text',      label: 'Text', icon: TextIcon },
  { id: 'hand',      label: 'Hand', icon: HandIcon },
]

const SHAPE_TYPES = [
  { id: 'line',   label: 'Line',   icon: LineIcon },
  { id: 'rect',   label: 'Rect',   icon: RectIcon },
  { id: 'circle', label: 'Circle', icon: CircleIcon },
]

// ── SVG Icons ────────────────────────────────────────────────────────────────
function PenIcon({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function FountainIcon({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 19l-7-7 9-9 5 5-7 11z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M5 12l2 2" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="20" r="1.5" fill={color}/>
    </svg>
  )
}
function BrushIcon({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M16 3l4 4-11 11H5v-4L16 3z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 20c0-1.5 1-2.5 2.5-2.5" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}
function PencilDrawIcon({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M15 5l4 4L7 21H3v-4L15 5z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 7l4 4" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}
function HighlighterIcon({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 3h6l4 8H5L9 3z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
      <rect x="9" y="11" width="6" height="6" rx="0" stroke={color} strokeWidth="1.8"/>
      <path d="M11 17v3m2-3v3" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}
function EraserIcon({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M20 20H7L3 16l10-10 7 7-3 4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.5 17.5l4-4" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}
function LassoIcon({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 7c2-3 8-3 10 0s0 7-3 8c-1.5.5-3 .5-4 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 15l-5 5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeDasharray="2 2"/>
    </svg>
  )
}
function ShapeIcon({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="10" width="8" height="8" rx="1" stroke={color} strokeWidth="1.8"/>
      <circle cx="16" cy="8" r="4.5" stroke={color} strokeWidth="1.8"/>
    </svg>
  )
}
function TextIcon({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16M12 6v13" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 19h8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}
function HandIcon({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M8 13V7a1 1 0 0 1 2 0v4M10 7V5a1 1 0 0 1 2 0v6M12 6a1 1 0 0 1 2 0v5M14 7a1 1 0 0 1 2 0v6l-1 4H9l-3-3v-3l2-2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function UndoIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 10h10a6 6 0 0 1 0 12H9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 10l4-4M3 10l4 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function RedoIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M21 10H11a6 6 0 0 0 0 12h4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 10l-4-4M21 10l-4 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function BackIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M15 18l-6-6 6-6" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function ZoomInIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="10" cy="10" r="7" stroke={color} strokeWidth="1.8"/>
      <path d="M21 21l-4.35-4.35M7 10h6M10 7v6" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}
function ZoomOutIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="10" cy="10" r="7" stroke={color} strokeWidth="1.8"/>
      <path d="M21 21l-4.35-4.35M7 10h6" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}
function ExportIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function SettingsIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={color} strokeWidth="1.8"/>
    </svg>
  )
}
function ChevronLeft({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M10 12L6 8l4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function ChevronRight({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M6 12l4-4-4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function WristIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="7" y="2" width="10" height="20" rx="5" stroke={color} strokeWidth="1.8"/>
      <path d="M7 8h10M7 16h10" stroke={color} strokeWidth="1.4" strokeOpacity="0.5"/>
    </svg>
  )
}
function LineIcon({ size = 18, color = 'currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 18 18" fill="none"><path d="M3 15L15 3" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>
}
function RectIcon({ size = 18, color = 'currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="1.5" stroke={color} strokeWidth="1.8"/></svg>
}
function CircleIcon({ size = 18, color = 'currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6.5" stroke={color} strokeWidth="1.8"/></svg>
}

// ── Toolbar ──────────────────────────────────────────────────────────────────
export default function Toolbar({
  penType, setPenType,
  shapeType, setShapeType,
  color, setColor,
  size, setSize,
  zoom, setZoom,
  onUndo, onRedo,
  canUndo, canRedo,
  onExport, onOpenPageSettings,
  notebookName, pageName,
  onBack,
  onPrevPage, onNextPage,
  hasPrevPage, hasNextPage,
  pageIndex, pageTotal,
  wristGuard, onToggleWristGuard,
}) {
  const [showColor, setShowColor] = useState(false)
  const [showToolOpts, setShowToolOpts] = useState(false)
  const [recentColors, setRecentColors] = useState(['#000000', '#FF3B30', '#007AFF', '#34C759'])
  const colorBtnRef = useRef(null)
  const colorPopRef = useRef(null)
  const toolOptRef = useRef(null)

  useEffect(() => {
    if (!showColor && !showToolOpts) return
    function close(e) {
      if (colorBtnRef.current?.contains(e.target) || colorPopRef.current?.contains(e.target)) return
      if (toolOptRef.current?.contains(e.target)) return
      setShowColor(false)
      setShowToolOpts(false)
    }
    document.addEventListener('pointerdown', close, true)
    return () => document.removeEventListener('pointerdown', close, true)
  }, [showColor, showToolOpts])

  function handleColorChange(c) {
    setColor(c)
    setRecentColors(prev => [c, ...prev.filter(x => x.toLowerCase() !== c.toLowerCase())].slice(0, 8))
  }

  function handleToolClick(id) {
    if (id === penType) { setShowToolOpts(p => !p); setShowColor(false) }
    else { setPenType(id); setShowToolOpts(false) }
  }

  const isEraser = penType === 'eraser'
  const isSelect = penType === 'select'
  const isHand = penType === 'hand'
  const isShape = penType === 'shape'
  const hideColor = isEraser || isSelect || isHand

  return (
    <div className={styles.root}>
      {/* ── Nav bar ── */}
      <div className={styles.navBar}>
        <div className={styles.navLeft}>
          <button className={styles.backBtn} onClick={onBack}>
            <BackIcon size={22} color="#FFFFFF" />
            <span className={styles.backLabel}>{notebookName || 'Notebooks'}</span>
          </button>
        </div>

        <div className={styles.navCenter}>
          <button className={`${styles.pageNavBtn} ${!hasPrevPage ? styles.pageNavBtnDim : ''}`} onClick={onPrevPage} disabled={!hasPrevPage}>
            <ChevronLeft size={16} color="#FFFFFF" />
          </button>
          <span className={styles.pageCounter}>{pageIndex != null ? `${pageIndex + 1} / ${pageTotal}` : ''}</span>
          <button className={`${styles.pageNavBtn} ${!hasNextPage ? styles.pageNavBtnDim : ''}`} onClick={onNextPage} disabled={!hasNextPage}>
            <ChevronRight size={16} color="#FFFFFF" />
          </button>
        </div>

        <div className={styles.navRight}>
          <button className={`${styles.navBtn} ${!canUndo ? styles.navBtnDim : ''}`} onClick={onUndo} disabled={!canUndo} title="Undo">
            <UndoIcon size={19} color="#FFFFFF" />
          </button>
          <button className={`${styles.navBtn} ${!canRedo ? styles.navBtnDim : ''}`} onClick={onRedo} disabled={!canRedo} title="Redo">
            <RedoIcon size={19} color="#FFFFFF" />
          </button>
          <div className={styles.navSep} />
          <button className={`${styles.navBtn} ${wristGuard ? styles.navBtnActive : ''}`} onClick={onToggleWristGuard} title="Palm rejection">
            <WristIcon size={18} color="#FFFFFF" />
          </button>
          <div className={styles.navSep} />
          <button className={styles.navBtn} onClick={() => setZoom(z => Math.max(0.25, +(z - 0.1).toFixed(2)))} title="Zoom out">
            <ZoomOutIcon size={18} color="#FFFFFF" />
          </button>
          <span className={styles.zoomLabel}>{Math.round(zoom * 100)}%</span>
          <button className={styles.navBtn} onClick={() => setZoom(z => Math.min(3, +(z + 0.1).toFixed(2)))} title="Zoom in">
            <ZoomInIcon size={18} color="#FFFFFF" />
          </button>
          <div className={styles.navSep} />
          <button className={styles.navBtn} onClick={onExport} title="Export">
            <ExportIcon size={18} color="#FFFFFF" />
          </button>
          <button className={styles.navBtn} onClick={onOpenPageSettings} title="Page settings">
            <SettingsIcon size={18} color="#FFFFFF" />
          </button>
        </div>
      </div>

      {/* ── Tool palette ── */}
      <div className={styles.palette}>
        {/* Tool buttons */}
        <div className={styles.toolRow}>
          {DRAW_TOOLS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`${styles.toolBtn} ${penType === id ? styles.toolBtnActive : ''}`}
              onClick={() => handleToolClick(id)}
              title={label}
            >
              <Icon size={22} color={penType === id ? '#FFFFFF' : 'var(--tool-color)'} />
              <span className={styles.toolLabel}>{label}</span>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className={styles.paletteDivider} />

        {/* Shape sub-types */}
        {isShape && (
          <>
            <div className={styles.shapeRow}>
              {SHAPE_TYPES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`${styles.shapeBtn} ${shapeType === id ? styles.shapeBtnActive : ''}`}
                  onClick={() => setShapeType(id)}
                  title={label}
                >
                  <Icon size={18} color={shapeType === id ? '#FFFFFF' : 'var(--tool-color)'} />
                </button>
              ))}
            </div>
            <div className={styles.paletteDivider} />
          </>
        )}

        {/* Color + size */}
        {!hideColor && (
          <>
            {/* Color swatch */}
            <button
              ref={colorBtnRef}
              className={`${styles.colorSwatch} ${showColor ? styles.colorSwatchOpen : ''}`}
              style={{ background: color, boxShadow: color === '#ffffff' || color === '#FFFFFF' ? 'inset 0 0 0 1.5px #ccc' : 'none' }}
              onClick={() => { setShowColor(p => !p); setShowToolOpts(false) }}
              title="Color"
            />

            {/* Recent colors */}
            <div className={styles.recentColors}>
              {recentColors.slice(0, 5).map(c => (
                <button
                  key={c}
                  className={`${styles.recentDot} ${color === c ? styles.recentDotActive : ''}`}
                  style={{ background: c, boxShadow: c === '#ffffff' || c === '#FFFFFF' ? 'inset 0 0 0 1px #ccc' : 'none' }}
                  onClick={() => handleColorChange(c)}
                />
              ))}
            </div>

            <div className={styles.paletteDivider} />

            {/* Size slider */}
            <div className={styles.sizeControl}>
              <div className={styles.sizePreview} style={{ width: Math.max(4, Math.min(size * 1.2, 26)), height: Math.max(4, Math.min(size * 1.2, 26)), background: penType === 'highlighter' ? color + '99' : color, borderRadius: '50%' }} />
              <input
                type="range" min={1} max={50} value={size}
                onChange={e => setSize(Number(e.target.value))}
                className={styles.sizeSlider}
              />
              <span className={styles.sizeVal}>{size}</span>
            </div>
          </>
        )}

        {/* Eraser size when eraser active */}
        {isEraser && (
          <div className={styles.sizeControl}>
            <div className={styles.sizePreview} style={{ width: Math.max(6, Math.min(size * 1.2, 26)), height: Math.max(6, Math.min(size * 1.2, 26)), background: '#aaa', borderRadius: '50%' }} />
            <input type="range" min={1} max={80} value={size} onChange={e => setSize(Number(e.target.value))} className={styles.sizeSlider} />
            <span className={styles.sizeVal}>{size}</span>
          </div>
        )}
      </div>

      {/* ── Color wheel popup ── */}
      {showColor && (
        <div ref={colorPopRef} className={styles.colorPop}>
          <ColorWheel color={color} onChange={handleColorChange} onClose={() => setShowColor(false)} recentColors={recentColors} />
        </div>
      )}

      {/* ── Tool options popup ── */}
      {showToolOpts && (
        <div ref={toolOptRef} className={styles.toolOptsPop}>
          <div className={styles.toolOptsTitle}>{DRAW_TOOLS.find(t => t.id === penType)?.label}</div>
          {!isSelect && !isHand && (
            <div className={styles.optRow}>
              <span className={styles.optLabel}>Size</span>
              <input type="range" min={1} max={50} value={size} onChange={e => setSize(Number(e.target.value))} className={styles.optSlider} />
              <span className={styles.optVal}>{size}px</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
