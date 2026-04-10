import { useState, useRef, useEffect } from 'react'
import ColorWheel from './ColorWheel'
import styles from './Toolbar.module.css'
import {
  PenIcon, FountainPenIcon, BrushIcon, PencilIcon, HighlighterIcon,
  EraserIcon, SelectionIcon, TextIcon, ShapeToolIcon, HandScrollIcon,
  UndoIcon, RedoIcon, BackIcon, ZoomInIcon, ZoomOutIcon, ExportIcon,
  SettingsIcon, WristGuardIcon, ChevronLeftIcon, ChevronRightIcon,
  RectShapeIcon, CircleShapeIcon, LineShapeIcon,
} from './ToolIcons'

const DRAW_TOOLS = [
  { id: 'ballpoint',   label: 'Pen',        Icon: PenIcon },
  { id: 'fountain',    label: 'Fountain',   Icon: FountainPenIcon },
  { id: 'brush',       label: 'Brush',      Icon: BrushIcon },
  { id: 'pencil',      label: 'Pencil',     Icon: PencilIcon },
  { id: 'highlighter', label: 'Hi-lite',    Icon: HighlighterIcon },
  { id: 'eraser',      label: 'Eraser',     Icon: EraserIcon },
  { id: 'select',      label: 'Select',     Icon: SelectionIcon },
  { id: 'shape',       label: 'Shape',      Icon: ShapeToolIcon },
  { id: 'text',        label: 'Text',       Icon: TextIcon },
  { id: 'hand',        label: 'Hand',       Icon: HandScrollIcon },
]

const SHAPE_TYPES = [
  { id: 'line',   Icon: LineShapeIcon },
  { id: 'rect',   Icon: RectShapeIcon },
  { id: 'circle', Icon: CircleShapeIcon },
]

export default function Toolbar({
  penType, setPenType,
  shapeType, setShapeType,
  color, setColor,
  size, setSize,
  zoom, setZoom,
  onUndo, onRedo,
  canUndo, canRedo,
  onExport, onOpenPageSettings,
  notebookName,
  onBack,
  onPrevPage, onNextPage,
  hasPrevPage, hasNextPage,
  pageIndex, pageTotal,
  wristGuard, onToggleWristGuard,
}) {
  const [showColor, setShowColor] = useState(false)
  const [recentColors, setRecentColors] = useState(['#000000', '#FF3B30', '#007AFF', '#34C759'])
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
  const isSelect = penType === 'select'
  const isHand = penType === 'hand'
  const isShape = penType === 'shape'
  const hideColor = isEraser || isSelect || isHand
  const maxSize = isEraser ? 80 : 50

  return (
    <div className={styles.root}>
      {/* ── Top nav bar ── */}
      <div className={styles.navBar}>
        <div className={styles.navLeft}>
          <button className={styles.backBtn} onClick={onBack}>
            <BackIcon size={20} color="#FFFFFF" />
            <span className={styles.backLabel}>{notebookName || 'Notebooks'}</span>
          </button>
        </div>

        <div className={styles.navCenter}>
          <button
            className={`${styles.pageNavBtn} ${!hasPrevPage ? styles.dim : ''}`}
            onClick={onPrevPage}
            disabled={!hasPrevPage}
          >
            <ChevronLeftIcon size={16} color="#FFFFFF" />
          </button>
          <span className={styles.pageCounter}>
            {pageIndex != null ? `${pageIndex + 1} / ${pageTotal}` : ''}
          </span>
          <button
            className={`${styles.pageNavBtn} ${!hasNextPage ? styles.dim : ''}`}
            onClick={onNextPage}
            disabled={!hasNextPage}
          >
            <ChevronRightIcon size={16} color="#FFFFFF" />
          </button>
        </div>

        <div className={styles.navRight}>
          <button
            className={`${styles.navBtn} ${!canUndo ? styles.dim : ''}`}
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo"
          >
            <UndoIcon size={18} color="#FFFFFF" />
          </button>
          <button
            className={`${styles.navBtn} ${!canRedo ? styles.dim : ''}`}
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo"
          >
            <RedoIcon size={18} color="#FFFFFF" />
          </button>

          <div className={styles.navSep} />

          <button
            className={`${styles.navBtn} ${wristGuard ? styles.navBtnActive : ''}`}
            onClick={onToggleWristGuard}
            title="Palm rejection"
          >
            <WristGuardIcon size={17} color="#FFFFFF" />
          </button>

          <div className={styles.navSep} />

          <button
            className={styles.navBtn}
            onClick={() => setZoom(z => Math.max(0.25, +(z - 0.1).toFixed(2)))}
            title="Zoom out"
          >
            <ZoomOutIcon size={17} color="#FFFFFF" />
          </button>
          <span className={styles.zoomLabel}>{Math.round(zoom * 100)}%</span>
          <button
            className={styles.navBtn}
            onClick={() => setZoom(z => Math.min(3, +(z + 0.1).toFixed(2)))}
            title="Zoom in"
          >
            <ZoomInIcon size={17} color="#FFFFFF" />
          </button>

          <div className={styles.navSep} />

          <button className={styles.navBtn} onClick={onExport} title="Export page">
            <ExportIcon size={17} color="#FFFFFF" />
          </button>
          <button className={styles.navBtn} onClick={onOpenPageSettings} title="Page settings">
            <SettingsIcon size={17} color="#FFFFFF" />
          </button>
        </div>
      </div>

      {/* ── Floating vertical tool panel ── */}
      <div className={styles.panel}>
        {/* Drawing tools */}
        <div className={styles.toolStack}>
          {DRAW_TOOLS.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`${styles.toolBtn} ${penType === id ? styles.toolBtnActive : ''}`}
              onClick={() => setPenType(id)}
              title={label}
            >
              <Icon size={22} color={penType === id ? '#FFFFFF' : '#3C3C43'} />
              <span className={styles.toolLabel}>{label}</span>
            </button>
          ))}
        </div>

        {/* Shape sub-type selector */}
        {isShape && (
          <>
            <div className={styles.panelDivider} />
            <div className={styles.shapeRow}>
              {SHAPE_TYPES.map(({ id, Icon }) => (
                <button
                  key={id}
                  className={`${styles.shapeBtn} ${shapeType === id ? styles.shapeBtnActive : ''}`}
                  onClick={() => setShapeType(id)}
                >
                  <Icon size={16} color={shapeType === id ? '#FFFFFF' : '#3C3C43'} />
                </button>
              ))}
            </div>
          </>
        )}

        {/* Color + size controls */}
        {!hideColor && (
          <>
            <div className={styles.panelDivider} />

            {/* Active color swatch */}
            <button
              ref={colorBtnRef}
              className={`${styles.colorSwatch} ${showColor ? styles.colorSwatchOpen : ''}`}
              style={{
                background: color,
                boxShadow: (color === '#ffffff' || color === '#FFFFFF')
                  ? 'inset 0 0 0 1.5px #ccc'
                  : 'none',
              }}
              onClick={() => setShowColor(p => !p)}
              title="Color"
            />

            {/* Recent colors */}
            <div className={styles.recentColors}>
              {recentColors.slice(0, 5).map(c => (
                <button
                  key={c}
                  className={`${styles.recentDot} ${color === c ? styles.recentDotActive : ''}`}
                  style={{
                    background: c,
                    boxShadow: (c === '#ffffff' || c === '#FFFFFF')
                      ? 'inset 0 0 0 1px #ccc'
                      : 'none',
                  }}
                  onClick={() => handleColorChange(c)}
                />
              ))}
            </div>

            <div className={styles.panelDivider} />

            {/* Size slider */}
            <div className={styles.sizeControl}>
              <div
                className={styles.sizePreview}
                style={{
                  width: Math.max(4, Math.min(size * 1.1, 24)),
                  height: Math.max(4, Math.min(size * 1.1, 24)),
                  background: penType === 'highlighter' ? color + '99' : color,
                  borderRadius: '50%',
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
              <span className={styles.sizeVal}>{size}</span>
            </div>
          </>
        )}

        {/* Eraser size */}
        {isEraser && (
          <>
            <div className={styles.panelDivider} />
            <div className={styles.sizeControl}>
              <div
                className={styles.sizePreview}
                style={{
                  width: Math.max(6, Math.min(size * 0.8, 24)),
                  height: Math.max(6, Math.min(size * 0.8, 24)),
                  background: '#AEAEB2',
                  borderRadius: '50%',
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
              <span className={styles.sizeVal}>{size}</span>
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
