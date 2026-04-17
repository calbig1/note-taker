import { useState, useRef, useEffect } from 'react'
import ColorWheel from './ColorWheel'
import styles from './Toolbar.module.css'
import {
  PenIcon, FountainPenIcon, BrushIcon, PencilIcon, HighlighterIcon,
  EraserIcon, SelectionIcon, LassoIcon, TextIcon, ShapeToolIcon, HandScrollIcon,
  UndoIcon, RedoIcon, BackIcon, ZoomInIcon, ZoomOutIcon, ExportIcon,
  SettingsIcon, WristGuardIcon, ChevronLeftIcon, ChevronRightIcon,
  RectShapeIcon, CircleShapeIcon, LineShapeIcon, TriangleShapeIcon,
  KeyboardIcon, ImageIcon,
} from './ToolIcons'

const DRAW_TOOLS = [
  { id: 'ballpoint',   label: 'Pen',     Icon: PenIcon,        group: 'pen' },
  { id: 'fountain',    label: 'Fountain',Icon: FountainPenIcon,group: 'pen' },
  { id: 'brush',       label: 'Brush',   Icon: BrushIcon,      group: 'pen' },
  { id: 'pencil',      label: 'Pencil',  Icon: PencilIcon,     group: 'pen' },
  { id: 'highlighter', label: 'Hi-lite', Icon: HighlighterIcon,group: 'pen' },
  { id: 'eraser',      label: 'Eraser',  Icon: EraserIcon,     group: 'utility' },
  { id: 'select',      label: 'Select',  Icon: SelectionIcon,  group: 'utility' },
  { id: 'lasso',       label: 'Lasso',   Icon: LassoIcon,      group: 'utility' },
  { id: 'shape',       label: 'Shape',   Icon: ShapeToolIcon,  group: 'utility' },
  { id: 'text',        label: 'Text',    Icon: TextIcon,       group: 'utility' },
  { id: 'hand',        label: 'Hand',    Icon: HandScrollIcon, group: 'utility' },
]

const SHAPE_TYPES = [
  { id: 'line',     Icon: LineShapeIcon,     label: 'Line' },
  { id: 'rect',     Icon: RectShapeIcon,     label: 'Rect' },
  { id: 'circle',   Icon: CircleShapeIcon,   label: 'Oval' },
  { id: 'triangle', Icon: TriangleShapeIcon, label: 'Tri' },
]

// Group tools with a divider between groups
const PEN_TOOLS = DRAW_TOOLS.filter(t => t.group === 'pen')
const UTILITY_TOOLS = DRAW_TOOLS.filter(t => t.group === 'utility')

export default function Toolbar({
  penType, setPenType,
  shapeType, setShapeType,
  color, setColor,
  size, setSize,
  zoom, setZoom,
  onUndo, onRedo,
  canUndo, canRedo,
  onExport, onOpenPageSettings,
  onShowShortcuts,
  notebookName,
  onBack,
  onPrevPage, onNextPage,
  hasPrevPage, hasNextPage,
  pageIndex, pageTotal,
  wristGuard, onToggleWristGuard,
}) {
  const [showColor, setShowColor] = useState(false)
  const [recentColors, setRecentColors] = useState(['#000000', '#FF3B30', '#007AFF', '#34C759', '#FF9F0A'])
  const colorBtnRef = useRef(null)
  const colorPopRef = useRef(null)

  useEffect(() => {
    if (!showColor) return
    function close(e) {
      if (colorBtnRef.current?.contains(e.target)) return
      if (colorPopRef.current?.contains(e.target)) return
      setShowColor(false)
    }
    document.addEventListener('pointerdown', close, true)
    return () => document.removeEventListener('pointerdown', close, true)
  }, [showColor])

  function handleColorChange(c) {
    setColor(c)
    setRecentColors(prev => [c, ...prev.filter(x => x.toLowerCase() !== c.toLowerCase())].slice(0, 6))
  }

  const isEraser = penType === 'eraser'
  const isSelect = penType === 'select' || penType === 'lasso'
  const isHand = penType === 'hand'
  const isShape = penType === 'shape'
  const hideColor = isEraser || isSelect || isHand
  const maxSize = isEraser ? 80 : 50

  return (
    <div className={styles.root}>
      {/* ── Top nav bar ── */}
      <div className={styles.navBar}>
        <div className={styles.navLeft}>
          <button className={styles.backBtn} onClick={onBack} title="Back to notebook">
            <BackIcon size={19} color="currentColor" />
            <span className={styles.backLabel}>{notebookName || 'Notebooks'}</span>
          </button>
        </div>

        <div className={styles.navCenter}>
          <button
            className={`${styles.pageNavBtn} ${!hasPrevPage ? styles.dim : ''}`}
            onClick={onPrevPage}
            disabled={!hasPrevPage}
            title="Previous page"
          >
            <ChevronLeftIcon size={16} color="currentColor" />
          </button>
          <span className={styles.pageCounter}>
            {pageIndex != null ? `${pageIndex + 1} / ${pageTotal}` : ''}
          </span>
          <button
            className={`${styles.pageNavBtn} ${!hasNextPage ? styles.dim : ''}`}
            onClick={onNextPage}
            disabled={!hasNextPage}
            title="Next page"
          >
            <ChevronRightIcon size={16} color="currentColor" />
          </button>
        </div>

        <div className={styles.navRight}>
          <button
            className={`${styles.navBtn} ${!canUndo ? styles.dim : ''}`}
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (⌘Z)"
          >
            <UndoIcon size={18} color="currentColor" />
          </button>
          <button
            className={`${styles.navBtn} ${!canRedo ? styles.dim : ''}`}
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (⌘⇧Z)"
          >
            <RedoIcon size={18} color="currentColor" />
          </button>

          <div className={styles.navSep} />

          <button
            className={`${styles.navBtn} ${wristGuard ? styles.navBtnActive : ''}`}
            onClick={onToggleWristGuard}
            title="Palm rejection"
          >
            <WristGuardIcon size={17} color="currentColor" />
          </button>

          <div className={styles.navSep} />

          <button
            className={styles.navBtn}
            onClick={() => setZoom(z => Math.max(0.25, +(z - 0.1).toFixed(2)))}
            title="Zoom out (-)"
          >
            <ZoomOutIcon size={17} color="currentColor" />
          </button>
          <button
            className={styles.zoomPill}
            onClick={() => setZoom(1)}
            title="Reset zoom (⌘0)"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            className={styles.navBtn}
            onClick={() => setZoom(z => Math.min(3, +(z + 0.1).toFixed(2)))}
            title="Zoom in (+)"
          >
            <ZoomInIcon size={17} color="currentColor" />
          </button>

          <div className={styles.navSep} />

          <button className={styles.navBtn} onClick={onExport} title="Export to PNG">
            <ExportIcon size={17} color="currentColor" />
          </button>
          <button className={styles.navBtn} onClick={onOpenPageSettings} title="Page settings">
            <SettingsIcon size={17} color="currentColor" />
          </button>
          {onShowShortcuts && (
            <button className={styles.navBtn} onClick={onShowShortcuts} title="Keyboard shortcuts (?)">
              <KeyboardIcon size={17} color="currentColor" />
            </button>
          )}
        </div>
      </div>

      {/* ── Floating vertical tool panel ── */}
      <div className={styles.panel}>
        {/* Pen tools group */}
        <div className={styles.groupLabel}>Pen</div>
        <div className={styles.toolStack}>
          {PEN_TOOLS.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`${styles.toolBtn} ${penType === id ? styles.toolBtnActive : ''}`}
              onClick={() => setPenType(id)}
              title={label}
            >
              <Icon size={22} color={penType === id ? '#FFFFFF' : 'var(--text-secondary)'} />
              <span className={styles.toolLabel}>{label}</span>
            </button>
          ))}
        </div>

        <div className={styles.panelDivider} />

        {/* Utility tools group */}
        <div className={styles.groupLabel}>Tools</div>
        <div className={styles.toolStack}>
          {UTILITY_TOOLS.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`${styles.toolBtn} ${penType === id ? styles.toolBtnActive : ''}`}
              onClick={() => setPenType(id)}
              title={label}
            >
              <Icon size={22} color={penType === id ? '#FFFFFF' : 'var(--text-secondary)'} />
              <span className={styles.toolLabel}>{label}</span>
            </button>
          ))}
        </div>

        {/* Shape sub-type selector */}
        {isShape && (
          <>
            <div className={styles.panelDivider} />
            <div className={styles.groupLabel}>Shape</div>
            <div className={styles.shapeRow}>
              {SHAPE_TYPES.map(({ id, Icon, label }) => (
                <button
                  key={id}
                  className={`${styles.shapeBtn} ${shapeType === id ? styles.shapeBtnActive : ''}`}
                  onClick={() => setShapeType(id)}
                  title={label}
                >
                  <Icon size={16} color={shapeType === id ? '#FFFFFF' : 'var(--text-secondary)'} />
                  <span className={styles.shapeBtnLabel}>{label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Color + size controls */}
        {!hideColor && (
          <>
            <div className={styles.panelDivider} />
            <div className={styles.groupLabel}>Color</div>

            <button
              ref={colorBtnRef}
              className={`${styles.colorSwatch} ${showColor ? styles.colorSwatchOpen : ''}`}
              style={{
                background: color,
                boxShadow: (color === '#ffffff' || color === '#FFFFFF')
                  ? 'inset 0 0 0 1.5px rgba(0,0,0,0.2), 0 0 0 2px rgba(255,255,255,0.08)'
                  : undefined,
              }}
              onClick={() => setShowColor(p => !p)}
              title="Pick color"
            />

            <div className={styles.recentColors}>
              {recentColors.slice(0, 5).map(c => (
                <button
                  key={c}
                  className={`${styles.recentDot} ${color === c ? styles.recentDotActive : ''}`}
                  style={{
                    background: c,
                    boxShadow: (c === '#ffffff' || c === '#FFFFFF')
                      ? 'inset 0 0 0 1px rgba(0,0,0,0.2)'
                      : undefined,
                  }}
                  onClick={() => handleColorChange(c)}
                  title={c}
                />
              ))}
            </div>

            <div className={styles.panelDivider} />
            <div className={styles.groupLabel}>Size</div>

            <div className={styles.sizeControl}>
              <div
                className={styles.sizePreview}
                style={{
                  width: Math.max(4, Math.min(size * 1.1, 26)),
                  height: Math.max(4, Math.min(size * 1.1, 26)),
                  background: penType === 'highlighter' ? color + '99' : color,
                  borderRadius: '50%',
                  border: (color === '#ffffff' || color === '#FFFFFF') ? '1px solid rgba(0,0,0,0.2)' : undefined,
                }}
              />
              <input
                type="range"
                min={1}
                max={maxSize}
                value={size}
                onChange={e => setSize(Number(e.target.value))}
                className={styles.sizeSlider}
              />
              <span className={styles.sizeVal}>{size}px</span>
            </div>
          </>
        )}

        {/* Eraser size */}
        {isEraser && (
          <>
            <div className={styles.panelDivider} />
            <div className={styles.groupLabel}>Size</div>
            <div className={styles.sizeControl}>
              <div
                className={styles.sizePreview}
                style={{
                  width: Math.max(6, Math.min(size * 0.8, 26)),
                  height: Math.max(6, Math.min(size * 0.8, 26)),
                  background: 'var(--bg-elevated)',
                  borderRadius: '50%',
                  border: '1.5px solid var(--border)',
                }}
              />
              <input
                type="range"
                min={1}
                max={80}
                value={size}
                onChange={e => setSize(Number(e.target.value))}
                className={styles.sizeSlider}
              />
              <span className={styles.sizeVal}>{size}px</span>
            </div>
          </>
        )}
      </div>

      {/* ── Color wheel popup ── */}
      {showColor && (
        <div ref={colorPopRef} className={styles.colorPop}>
          <ColorWheel
            color={color}
            onChange={handleColorChange}
            onClose={() => setShowColor(false)}
            recentColors={recentColors}
          />
        </div>
      )}
    </div>
  )
}
