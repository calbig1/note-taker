import { useState, useRef, useEffect } from 'react'
import {
  PenIcon, FountainPenIcon, BrushIcon, PencilIcon, HighlighterIcon, EraserIcon,
  UndoIcon, RedoIcon, BackIcon, ExportIcon, SettingsIcon, ZoomInIcon, ZoomOutIcon,
  SelectionIcon, TextIcon, ShapeToolIcon, WristGuardIcon, HandScrollIcon,
  RectShapeIcon, CircleShapeIcon, LineShapeIcon,
  ChevronLeftIcon, ChevronRightIcon,
} from './ToolIcons'
import ColorWheel from './ColorWheel'
import styles from './Toolbar.module.css'

const PRESET_SIZES = [2, 4, 8, 14, 24]
const MAX_RECENT = 8

const DRAW_TOOLS = [
  { id: 'ballpoint',   label: 'Ballpoint',    Icon: PenIcon },
  { id: 'fountain',    label: 'Fountain Pen', Icon: FountainPenIcon },
  { id: 'brush',       label: 'Brush Pen',    Icon: BrushIcon },
  { id: 'pencil',      label: 'Pencil',       Icon: PencilIcon },
  { id: 'highlighter', label: 'Highlighter',  Icon: HighlighterIcon },
  { id: 'eraser',      label: 'Eraser',       Icon: EraserIcon },
  { id: 'select',      label: 'Select',       Icon: SelectionIcon },
  { id: 'text',        label: 'Text',         Icon: TextIcon },
  { id: 'shape',       label: 'Shape',        Icon: ShapeToolIcon },
  { id: 'hand',        label: 'Scroll',       Icon: HandScrollIcon },
]

const SHAPE_TYPES = [
  { id: 'line',   label: 'Line',      Icon: LineShapeIcon },
  { id: 'rect',   label: 'Rectangle', Icon: RectShapeIcon },
  { id: 'circle', label: 'Circle',    Icon: CircleShapeIcon },
]

export default function Toolbar({
  penType, setPenType,
  shapeType, setShapeType,
  color, setColor,
  size, setSize,
  zoom, setZoom,
  onUndo, onRedo,
  canUndo, canRedo,
  onExport,
  onOpenPageSettings,
  notebookName,
  pageName,
  onBack,
  onPrevPage, onNextPage,
  hasPrevPage, hasNextPage,
  pageIndex, pageTotal,
  wristGuard, onToggleWristGuard,
}) {
  const [showColorWheel, setShowColorWheel] = useState(false)
  const [showToolOptions, setShowToolOptions] = useState(false)
  const [eraserMode, setEraserMode] = useState('pixel')
  const [recentColors, setRecentColors] = useState(['#000000'])
  const colorSwatchRef = useRef(null)
  const toolOptionsRef = useRef(null)
  const colorWheelRef = useRef(null)

  useEffect(() => {
    if (!showColorWheel && !showToolOptions) return
    function handleClick(e) {
      if (
        colorSwatchRef.current?.contains(e.target) ||
        colorWheelRef.current?.contains(e.target) ||
        toolOptionsRef.current?.contains(e.target)
      ) return
      setShowColorWheel(false)
      setShowToolOptions(false)
    }
    document.addEventListener('pointerdown', handleClick, true)
    return () => document.removeEventListener('pointerdown', handleClick, true)
  }, [showColorWheel, showToolOptions])

  function handleColorChange(newColor) {
    setColor(newColor)
    setRecentColors(prev => {
      const filtered = prev.filter(c => c.toLowerCase() !== newColor.toLowerCase())
      return [newColor, ...filtered].slice(0, MAX_RECENT)
    })
  }

  function handleToolClick(id) {
    if (id === penType) {
      setShowToolOptions(prev => !prev)
      setShowColorWheel(false)
    } else {
      setPenType(id)
      setShowToolOptions(false)
    }
  }

  function handleColorSwatchClick() {
    setShowColorWheel(prev => !prev)
    setShowToolOptions(false)
  }

  const isEraser = penType === 'eraser'
  const isHighlighter = penType === 'highlighter'
  const isSelect = penType === 'select'
  const isShape = penType === 'shape'
  const isHand = penType === 'hand'
  const hideColor = isEraser || isSelect || isHand
  const hideSizeControls = isSelect || isHand

  return (
    <div className={styles.toolbarRoot}>
      {/* ── Header bar ──────────────────────────────────────────────────────── */}
      <div className={styles.headerBar}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={onBack} title="Back to notebook">
            <BackIcon size={20} color="var(--blue-primary)" />
          </button>
          <div className={styles.breadcrumb}>
            <span className={styles.breadcrumbNotebook}>{notebookName}</span>
            {pageName && (
              <>
                <span className={styles.breadcrumbSep}>/</span>
                <span className={styles.breadcrumbPage}>{pageName}</span>
              </>
            )}
          </div>
        </div>

        <div className={styles.headerCenter}>
          <button
            className={`${styles.navBtn} ${!hasPrevPage ? styles.navBtnDisabled : ''}`}
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
            className={`${styles.navBtn} ${!hasNextPage ? styles.navBtnDisabled : ''}`}
            onClick={onNextPage}
            disabled={!hasNextPage}
            title="Next page"
          >
            <ChevronRightIcon size={16} color="currentColor" />
          </button>
        </div>

        <div className={styles.headerRight}>
          <button
            className={`${styles.headerBtn} ${!canUndo ? styles.headerBtnDisabled : ''}`}
            onClick={onUndo} disabled={!canUndo} title="Undo (⌘Z)"
          >
            <UndoIcon size={18} color="currentColor" />
          </button>
          <button
            className={`${styles.headerBtn} ${!canRedo ? styles.headerBtnDisabled : ''}`}
            onClick={onRedo} disabled={!canRedo} title="Redo (⌘⇧Z)"
          >
            <RedoIcon size={18} color="currentColor" />
          </button>

          <div className={styles.headerDivider} />

          <button
            className={styles.headerBtn}
            onClick={() => setZoom(z => Math.max(0.25, +(z - 0.1).toFixed(2)))}
            title="Zoom out"
          >
            <ZoomOutIcon size={18} color="currentColor" />
          </button>
          <span className={styles.zoomLabel}>{Math.round(zoom * 100)}%</span>
          <button
            className={styles.headerBtn}
            onClick={() => setZoom(z => Math.min(3, +(z + 0.1).toFixed(2)))}
            title="Zoom in"
          >
            <ZoomInIcon size={18} color="currentColor" />
          </button>

          <div className={styles.headerDivider} />

          <button
            className={`${styles.headerBtn} ${wristGuard ? styles.headerBtnActive : ''}`}
            onClick={onToggleWristGuard}
            title={wristGuard ? 'Wrist guard on' : 'Wrist guard off'}
          >
            <WristGuardIcon size={18} color="currentColor" />
          </button>

          <div className={styles.headerDivider} />

          <button className={styles.headerBtn} onClick={onExport} title="Export PNG">
            <ExportIcon size={18} color="currentColor" />
          </button>
          <button className={styles.headerBtn} onClick={onOpenPageSettings} title="Page settings">
            <SettingsIcon size={18} color="currentColor" />
          </button>
        </div>
      </div>

      {/* ── Drawing tools bar ──────────────────────────────────────────────── */}
      <div className={styles.toolsBar}>
        {/* Tool buttons */}
        <div className={styles.toolGroup}>
          {DRAW_TOOLS.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`${styles.toolBtn} ${penType === id ? styles.toolBtnActive : ''}`}
              onClick={() => handleToolClick(id)}
              title={label}
            >
              <Icon size={22} color={penType === id ? 'white' : 'var(--gray-700)'} />
            </button>
          ))}
        </div>

        <div className={styles.toolsDivider} />

        {/* Shape sub-type selector */}
        {isShape && (
          <>
            <div className={styles.shapeGroup}>
              {SHAPE_TYPES.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  className={`${styles.shapeBtn} ${shapeType === id ? styles.shapeBtnActive : ''}`}
                  onClick={() => setShapeType(id)}
                  title={label}
                >
                  <Icon size={18} color={shapeType === id ? 'white' : 'var(--gray-600)'} />
                </button>
              ))}
            </div>
            <div className={styles.toolsDivider} />
          </>
        )}

        {/* Color swatch */}
        {!hideColor && (
          <>
            <div className={styles.colorSection}>
              <button
                ref={colorSwatchRef}
                className={`${styles.colorSwatch} ${showColorWheel ? styles.colorSwatchOpen : ''}`}
                style={{
                  background: color,
                  border: color === '#ffffff' || color === '#FFFFFF'
                    ? '2px solid var(--gray-300)'
                    : '2px solid transparent',
                }}
                onClick={handleColorSwatchClick}
                title="Color picker"
              />
              <div
                className={styles.sizeIndicator}
                style={{
                  width: Math.max(4, Math.min(size * 0.9, 24)),
                  height: Math.max(4, Math.min(size * 0.9, 24)),
                  background: color,
                  border: (color === '#ffffff' || color === '#FFFFFF')
                    ? '1px solid var(--gray-400)' : undefined,
                }}
              />
            </div>
            <div className={styles.toolsDivider} />
          </>
        )}

        {/* Size presets + inline slider */}
        {!hideSizeControls && (
          <>
            <div className={styles.sizeGroup}>
              {PRESET_SIZES.map(s => (
                <button
                  key={s}
                  className={`${styles.sizeDotBtn} ${size === s ? styles.sizeDotBtnActive : ''}`}
                  onClick={() => setSize(s)}
                  title={`${s}px`}
                >
                  <span
                    className={styles.sizeDot}
                    style={{
                      width: Math.min(s * 1.1, 22),
                      height: Math.min(s * 1.1, 22),
                      background: isEraser ? 'var(--gray-400)' : (hideColor ? 'var(--gray-500)' : color),
                    }}
                  />
                </button>
              ))}
            </div>

            <div className={styles.toolsDivider} />

            {/* Inline size slider — always visible */}
            <div className={styles.inlineSliderGroup}>
              <span className={styles.inlineSliderLabel}>Size</span>
              <input
                type="range"
                min={1}
                max={50}
                value={size}
                onChange={e => setSize(Number(e.target.value))}
                className={styles.inlineSizeSlider}
              />
              <span className={styles.inlineSizeVal}>{size}px</span>
            </div>
          </>
        )}
      </div>

      {/* ── Color Wheel popup ──────────────────────────────────────────────── */}
      {showColorWheel && (
        <div ref={colorWheelRef} className={styles.colorWheelPopup}>
          <ColorWheel
            color={color}
            onChange={handleColorChange}
            onClose={() => setShowColorWheel(false)}
            recentColors={recentColors}
          />
        </div>
      )}

      {/* ── Tool Options panel ─────────────────────────────────────────────── */}
      {showToolOptions && (
        <div ref={toolOptionsRef} className={styles.toolOptionsPanel}>
          <div className={styles.optionsHeader}>
            <span className={styles.optionsTitle}>
              {DRAW_TOOLS.find(t => t.id === penType)?.label ?? 'Tool'} Options
            </span>
          </div>

          {!hideSizeControls && (
            <>
              <div className={styles.optionRow}>
                <span className={styles.optionLabel}>Size</span>
                <div className={styles.sliderRow}>
                  <input
                    type="range" min={1} max={50} value={size}
                    onChange={e => setSize(Number(e.target.value))}
                    className={styles.sizeSlider}
                  />
                  <span className={styles.sizeValue}>{size}px</span>
                </div>
              </div>

              <div className={styles.optionRow}>
                <span className={styles.optionLabel}>Presets</span>
                <div className={styles.presetSizes}>
                  {PRESET_SIZES.map(s => (
                    <button
                      key={s}
                      className={`${styles.presetSizeBtn} ${size === s ? styles.presetSizeBtnActive : ''}`}
                      onClick={() => setSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {!isEraser && !hideSizeControls && (
            <div className={styles.optionRow}>
              <span className={styles.optionLabel}>Opacity</span>
              <div className={styles.sliderRow}>
                <input
                  type="range" min={10} max={100}
                  value={isHighlighter ? 35 : 100}
                  disabled={isHighlighter}
                  className={styles.sizeSlider}
                  readOnly
                />
                <span className={styles.sizeValue}>{isHighlighter ? '35%' : '100%'}</span>
              </div>
            </div>
          )}

          {isEraser && (
            <div className={styles.optionRow}>
              <span className={styles.optionLabel}>Eraser Mode</span>
              <div className={styles.eraserModeRow}>
                <button
                  className={`${styles.eraserModeBtn} ${eraserMode === 'pixel' ? styles.eraserModeBtnActive : ''}`}
                  onClick={() => setEraserMode('pixel')}
                >
                  Pixel
                </button>
                <button
                  className={`${styles.eraserModeBtn} ${eraserMode === 'stroke' ? styles.eraserModeBtnActive : ''}`}
                  onClick={() => setEraserMode('stroke')}
                >
                  Stroke
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
