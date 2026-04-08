import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { drawPaper } from '../utils/drawPaper'
import { drawStroke, renderAllStrokes, renderTextElements } from '../utils/drawStrokes'
import styles from './Canvas.module.css'

const CANVAS_SIZES = {
  lined:      { width: 850,  height: 1100 },
  unlined:    { width: 850,  height: 1100 },
  dotgrid:    { width: 850,  height: 1100 },
  whiteboard: { width: 2400, height: 1600 },
}

function getBoundingBox(stroke) {
  if (stroke.shapeType) {
    const { start, end } = stroke
    if (!start || !end) return null
    return {
      x1: Math.min(start.x, end.x), y1: Math.min(start.y, end.y),
      x2: Math.max(start.x, end.x), y2: Math.max(start.y, end.y),
    }
  }
  if (!stroke.points || stroke.points.length === 0) return null
  let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity
  stroke.points.forEach(p => {
    x1 = Math.min(x1, p.x); y1 = Math.min(y1, p.y)
    x2 = Math.max(x2, p.x); y2 = Math.max(y2, p.y)
  })
  return { x1, y1, x2, y2 }
}

function rectIntersects(box, sel) {
  if (!box) return false
  return box.x1 <= sel.x2 && box.x2 >= sel.x1 && box.y1 <= sel.y2 && box.y2 >= sel.y1
}

const Canvas = forwardRef(function Canvas(
  { page, penType = 'ballpoint', shapeType = 'rect', color, size, zoom, onStrokesChange, onTextElementsChange, wristGuard },
  ref
) {
  const canvasRef = useRef(null)
  const wrapperRef = useRef(null)
  const isDrawing = useRef(false)
  const currentStroke = useRef(null)
  const offscreenRef = useRef(null)
  const penActiveRef = useRef(false)

  // Shape
  const shapeStartRef = useRef(null)
  const previewShapeRef = useRef(null)

  // Select
  const [selBox, setSelBox] = useState(null)
  const [selIds, setSelIds] = useState([])
  const selBoxRef = useRef(null)
  const movingRef = useRef(false)
  const moveStartRef = useRef(null)
  const selStrokesSnapshotRef = useRef([])

  // Text
  const [textPos, setTextPos] = useState(null)
  const [textValue, setTextValue] = useState('')
  const textareaRef = useRef(null)

  const canvasSize = CANVAS_SIZES[page.paperType] ?? CANVAS_SIZES.lined

  useImperativeHandle(ref, () => ({
    exportPNG() {
      const exportCanvas = document.createElement('canvas')
      exportCanvas.width = canvasSize.width
      exportCanvas.height = canvasSize.height
      const ctx = exportCanvas.getContext('2d')
      drawPaper(ctx, page, canvasSize.width, canvasSize.height)
      renderAllStrokes(ctx, page.strokes)
      renderTextElements(ctx, page.textElements)
      return exportCanvas.toDataURL('image/png')
    }
  }))

  useEffect(() => {
    const offscreen = document.createElement('canvas')
    offscreen.width = canvasSize.width
    offscreen.height = canvasSize.height
    offscreenRef.current = offscreen
    const ctx = offscreen.getContext('2d')
    drawPaper(ctx, page, canvasSize.width, canvasSize.height)
    renderAllStrokes(ctx, page.strokes)
    renderTextElements(ctx, page.textElements)
    redrawVisible()
  }, [page.id, page.paperType, page.paperColor, page.lineSpacing])

  useEffect(() => {
    const offscreen = offscreenRef.current
    if (!offscreen) return
    const ctx = offscreen.getContext('2d')
    ctx.clearRect(0, 0, offscreen.width, offscreen.height)
    drawPaper(ctx, page, canvasSize.width, canvasSize.height)
    renderAllStrokes(ctx, page.strokes)
    renderTextElements(ctx, page.textElements)
    redrawVisible()
  }, [page.strokes, page.textElements])

  function redrawVisible() {
    const canvas = canvasRef.current
    const offscreen = offscreenRef.current
    if (!canvas || !offscreen) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(offscreen, 0, 0)

    if (currentStroke.current) drawStroke(ctx, currentStroke.current)
    if (previewShapeRef.current) drawStroke(ctx, previewShapeRef.current)

    const box = selBoxRef.current
    if (box) {
      const bx = Math.min(box.x1, box.x2)
      const by = Math.min(box.y1, box.y2)
      const bw = Math.abs(box.x2 - box.x1)
      const bh = Math.abs(box.y2 - box.y1)
      ctx.save()
      if (selIds.length > 0) {
        ctx.fillStyle = 'rgba(37,99,235,0.07)'
        ctx.fillRect(bx - 2, by - 2, bw + 4, bh + 4)
      }
      ctx.strokeStyle = '#2563EB'
      ctx.lineWidth = 1.5
      ctx.setLineDash([5, 4])
      ctx.strokeRect(bx, by, bw, bh)
      ctx.setLineDash([])
      ctx.restore()
    }
  }

  const getPoint = useCallback((e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvasSize.width / rect.width
    const scaleY = canvasSize.height / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
      pressure: e.pressure ?? 0.5,
      screenX: e.clientX - rect.left,
      screenY: e.clientY - rect.top,
    }
  }, [canvasSize])

  function commitText() {
    if (!textPos || !textValue.trim()) {
      setTextPos(null)
      setTextValue('')
      return
    }
    const fontSize = Math.max(14, Math.round(size * 2.5))
    const el = {
      id: uuidv4(),
      x: textPos.canvasX,
      y: textPos.canvasY + fontSize,
      text: textValue,
      fontSize,
      color,
      fontFamily: 'sans-serif',
    }
    onTextElementsChange?.(prev => [...(prev ?? []), el])
    setTextPos(null)
    setTextValue('')
  }

  function deleteSelected() {
    if (selIds.length === 0) return
    onStrokesChange(prev => prev.filter(s => !selIds.includes(s.id)))
    setSelIds([])
    selBoxRef.current = null
    setSelBox(null)
  }

  useEffect(() => {
    function onKey(e) {
      if ((e.key === 'Delete' || e.key === 'Backspace') && !textPos) {
        deleteSelected()
      }
      if (e.key === 'Escape') {
        setTextPos(null)
        setTextValue('')
        setSelIds([])
        selBoxRef.current = null
        setSelBox(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selIds, textPos])

  useEffect(() => {
    if (textPos) setTimeout(() => textareaRef.current?.focus(), 20)
  }, [textPos])

  useEffect(() => { redrawVisible() }, [selBox, selIds])

  const onPointerDown = useCallback((e) => {
    if (e.button !== 0) return
    if (penType !== 'text' && textPos) { commitText(); return }

    if (e.pointerType === 'pen') {
      penActiveRef.current = true
    } else if (e.pointerType === 'touch') {
      if (wristGuard) return
      if (!['eraser', 'hand', 'select', 'text'].includes(penType)) return
    }

    e.preventDefault()
    canvasRef.current.setPointerCapture(e.pointerId)
    const pt = getPoint(e)

    if (penType === 'hand') return

    if (penType === 'text') {
      setTextPos({ screenX: pt.screenX, screenY: pt.screenY, canvasX: pt.x, canvasY: pt.y })
      setTextValue('')
      return
    }

    if (penType === 'select') {
      const box = selBoxRef.current
      if (box && selIds.length > 0) {
        const bx1 = Math.min(box.x1, box.x2), bx2 = Math.max(box.x1, box.x2)
        const by1 = Math.min(box.y1, box.y2), by2 = Math.max(box.y1, box.y2)
        if (pt.x >= bx1 && pt.x <= bx2 && pt.y >= by1 && pt.y <= by2) {
          movingRef.current = true
          moveStartRef.current = { x: pt.x, y: pt.y }
          selStrokesSnapshotRef.current = page.strokes.filter(s => selIds.includes(s.id))
          isDrawing.current = true
          return
        }
      }
      movingRef.current = false
      setSelIds([])
      const box2 = { x1: pt.x, y1: pt.y, x2: pt.x, y2: pt.y }
      selBoxRef.current = box2
      setSelBox(box2)
      isDrawing.current = true
      return
    }

    if (penType === 'shape') {
      shapeStartRef.current = { x: pt.x, y: pt.y }
      previewShapeRef.current = null
      isDrawing.current = true
      return
    }

    isDrawing.current = true
    const tool = penType === 'eraser' ? 'eraser' : penType === 'highlighter' ? 'highlighter' : 'pen'
    currentStroke.current = {
      id: uuidv4(),
      penType,
      tool,
      color: tool === 'eraser' ? 'rgba(0,0,0,1)' : color,
      size: tool === 'eraser' ? size * 3 : size,
      opacity: tool === 'highlighter' ? 0.4 : penType === 'pencil' ? 0.72 : 1,
      points: [{ x: pt.x, y: pt.y, pressure: pt.pressure }],
    }
  }, [penType, color, size, getPoint, textPos, selIds, page.strokes, wristGuard])

  const onPointerMove = useCallback((e) => {
    if (!isDrawing.current) return
    if (e.pointerType === 'touch' && !['eraser', 'select'].includes(penType)) return
    e.preventDefault()
    const pt = getPoint(e)

    if (penType === 'select') {
      if (movingRef.current && moveStartRef.current) {
        const dx = pt.x - moveStartRef.current.x
        const dy = pt.y - moveStartRef.current.y
        const snaps = selStrokesSnapshotRef.current
        if (snaps.length > 0) {
          const orig = snaps.reduce((acc, s) => {
            const b = getBoundingBox(s)
            if (!b) return acc
            return {
              x1: Math.min(acc.x1, b.x1), y1: Math.min(acc.y1, b.y1),
              x2: Math.max(acc.x2, b.x2), y2: Math.max(acc.y2, b.y2),
            }
          }, { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity })
          const newBox = {
            x1: orig.x1 + dx, y1: orig.y1 + dy,
            x2: orig.x2 + dx, y2: orig.y2 + dy,
          }
          selBoxRef.current = newBox
          setSelBox({ ...newBox })
        }
      } else {
        const updated = { ...selBoxRef.current, x2: pt.x, y2: pt.y }
        selBoxRef.current = updated
        setSelBox({ ...updated })
      }
      redrawVisible()
      return
    }

    if (penType === 'shape' && shapeStartRef.current) {
      previewShapeRef.current = {
        id: 'preview', tool: 'shape', shapeType, color, size,
        start: shapeStartRef.current, end: { x: pt.x, y: pt.y },
      }
      redrawVisible()
      return
    }

    if (currentStroke.current) {
      currentStroke.current.points.push({ x: pt.x, y: pt.y, pressure: pt.pressure })
      redrawVisible()
    }
  }, [penType, shapeType, color, size, getPoint])

  const onPointerUp = useCallback((e) => {
    if (!isDrawing.current) return
    isDrawing.current = false
    if (e.pointerType === 'pen') setTimeout(() => { penActiveRef.current = false }, 200)

    const pt = getPoint(e)

    if (penType === 'select') {
      if (movingRef.current && moveStartRef.current) {
        const dx = pt.x - moveStartRef.current.x
        const dy = pt.y - moveStartRef.current.y
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
          onStrokesChange(prev => prev.map(s => {
            if (!selIds.includes(s.id)) return s
            if (s.shapeType) {
              return { ...s,
                start: { x: s.start.x + dx, y: s.start.y + dy },
                end: { x: s.end.x + dx, y: s.end.y + dy },
              }
            }
            return { ...s, points: s.points.map(p => ({ ...p, x: p.x + dx, y: p.y + dy })) }
          }))
        }
        movingRef.current = false
        moveStartRef.current = null
      } else {
        const box = selBoxRef.current
        if (box) {
          const bx1 = Math.min(box.x1, box.x2), bx2 = Math.max(box.x1, box.x2)
          const by1 = Math.min(box.y1, box.y2), by2 = Math.max(box.y1, box.y2)
          if (Math.abs(bx2 - bx1) > 4 || Math.abs(by2 - by1) > 4) {
            const found = page.strokes
              .filter(s => rectIntersects(getBoundingBox(s), { x1: bx1, y1: by1, x2: bx2, y2: by2 }))
              .map(s => s.id)
            setSelIds(found)
            if (found.length === 0) { selBoxRef.current = null; setSelBox(null) }
          } else {
            selBoxRef.current = null; setSelBox(null); setSelIds([])
          }
        }
      }
      return
    }

    if (penType === 'shape' && shapeStartRef.current) {
      const shape = {
        id: uuidv4(), tool: 'shape', shapeType, color, size,
        start: shapeStartRef.current, end: { x: pt.x, y: pt.y },
      }
      onStrokesChange(prev => [...prev, shape])
      shapeStartRef.current = null
      previewShapeRef.current = null
      redrawVisible()
      return
    }

    if (currentStroke.current && currentStroke.current.points.length > 0) {
      onStrokesChange(prev => [...prev, currentStroke.current])
    }
    currentStroke.current = null
  }, [penType, shapeType, color, size, getPoint, selIds, page.strokes, onStrokesChange])

  const scaledWidth = canvasSize.width * zoom
  const scaledHeight = canvasSize.height * zoom

  const cursorStyle = penType === 'eraser' ? 'cell'
    : penType === 'select' ? (selIds.length > 0 ? 'move' : 'crosshair')
    : penType === 'text' ? 'text'
    : penType === 'hand' ? 'grab'
    : 'crosshair'

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div style={{ position: 'relative', display: 'inline-block', flexShrink: 0, margin: '32px' }}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          width={canvasSize.width}
          height={canvasSize.height}
          style={{ width: scaledWidth, height: scaledHeight, cursor: cursorStyle, display: 'block' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        />

        {wristGuard && (
          <div
            className={styles.wristGuard}
            style={{ width: scaledWidth * 0.22, height: scaledHeight }}
          />
        )}

        {textPos && (
          <div
            className={styles.textInputWrapper}
            style={{ left: textPos.screenX, top: textPos.screenY }}
          >
            <textarea
              ref={textareaRef}
              className={styles.textInput}
              value={textValue}
              onChange={e => setTextValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Escape') { setTextPos(null); setTextValue('') }
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitText() }
              }}
              onBlur={commitText}
              style={{
                fontSize: Math.max(14, Math.round(size * 2.5)) + 'px',
                color,
              }}
              placeholder="Type here, Enter to commit..."
              rows={1}
            />
          </div>
        )}

        {selIds.length > 0 && selBox && (
          <div
            className={styles.selBadge}
            style={{
              left: Math.min(selBox.x1, selBox.x2) * (scaledWidth / canvasSize.width),
              top: Math.max(0, Math.min(selBox.y1, selBox.y2) * (scaledHeight / canvasSize.height) - 36),
            }}
          >
            <span className={styles.selCount}>{selIds.length} selected</span>
            <button className={styles.selDeleteBtn} onClick={deleteSelected}>Delete</button>
          </div>
        )}
      </div>
    </div>
  )
})

export default Canvas
