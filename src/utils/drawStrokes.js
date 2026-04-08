// ── Stroke rendering — supports ballpoint, fountain, brush, pencil, highlighter, eraser ──

function dist(a, b) {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2)
}

// ── Standard smooth stroke (ballpoint / pencil / highlighter / eraser) ─────────
function drawSmoothStroke(ctx, stroke) {
  const { points, color, size, tool, opacity } = stroke
  if (!points || points.length === 0) return

  ctx.save()
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  if (tool === 'highlighter') {
    ctx.globalCompositeOperation = 'multiply'
    ctx.globalAlpha = 0.35
    ctx.strokeStyle = color
    ctx.lineWidth = size
  } else if (tool === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out'
    ctx.globalAlpha = 1
    ctx.strokeStyle = 'rgba(0,0,0,1)'
    ctx.lineWidth = size
  } else {
    // ballpoint / pencil
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = tool === 'pencil' ? (opacity ?? 0.72) : (opacity ?? 1)
    ctx.strokeStyle = color
    ctx.lineWidth = size
  }

  if (points.length === 1) {
    ctx.beginPath()
    ctx.arc(points[0].x, points[0].y, size / 2, 0, Math.PI * 2)
    ctx.fillStyle = tool === 'eraser' ? 'rgba(0,0,0,1)' : color
    ctx.globalAlpha = tool === 'pencil' ? (opacity ?? 0.72) : (tool === 'highlighter' ? 0.35 : (opacity ?? 1))
    ctx.fill()
    ctx.restore()
    return
  }

  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)

  if (points.length === 2) {
    ctx.lineTo(points[1].x, points[1].y)
  } else {
    for (let i = 1; i < points.length - 1; i++) {
      const midX = (points[i].x + points[i + 1].x) / 2
      const midY = (points[i].y + points[i + 1].y) / 2
      ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY)
    }
    const last = points[points.length - 1]
    ctx.lineTo(last.x, last.y)
  }

  ctx.stroke()
  ctx.restore()
}

// ── Fountain pen: variable width based on velocity, tapered start/end ──────────
function drawFountainStroke(ctx, stroke) {
  const { points, color, size, opacity } = stroke
  if (!points || points.length === 0) return
  if (points.length === 1) {
    ctx.save()
    ctx.globalAlpha = opacity ?? 1
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(points[0].x, points[0].y, size / 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
    return
  }

  // Calculate per-segment velocities → widths
  const velocities = [0]
  for (let i = 1; i < points.length; i++) {
    velocities.push(dist(points[i - 1], points[i]))
  }

  // Smooth velocities
  const smoothVel = velocities.map((v, i) => {
    const prev = velocities[Math.max(0, i - 1)]
    const next = velocities[Math.min(velocities.length - 1, i + 1)]
    return (prev + v + next) / 3
  })

  const maxV = Math.max(...smoothVel, 1)
  const minW = size * 0.25
  const maxW = size * 1.0

  // Width per point: slow = thick, fast = thin (fountain pen behavior)
  const widths = smoothVel.map((v, i) => {
    const speed = v / maxV
    let w = maxW - speed * (maxW - minW)
    // Taper start
    const taperIn = Math.min(i / Math.max(points.length * 0.08, 3), 1)
    // Taper end
    const taperOut = Math.min((points.length - 1 - i) / Math.max(points.length * 0.08, 3), 1)
    w *= Math.min(taperIn, taperOut)
    return Math.max(0.4, w)
  })

  ctx.save()
  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = opacity ?? 0.92
  ctx.fillStyle = color

  // Draw filled polygon segments
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i]
    const p2 = points[i + 1]
    const w1 = widths[i]
    const w2 = widths[i + 1]

    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x)
    const perp = angle + Math.PI / 2

    const dx1 = Math.cos(perp) * w1 / 2
    const dy1 = Math.sin(perp) * w1 / 2
    const dx2 = Math.cos(perp) * w2 / 2
    const dy2 = Math.sin(perp) * w2 / 2

    ctx.beginPath()
    ctx.moveTo(p1.x + dx1, p1.y + dy1)
    ctx.lineTo(p2.x + dx2, p2.y + dy2)
    ctx.lineTo(p2.x - dx2, p2.y - dy2)
    ctx.lineTo(p1.x - dx1, p1.y - dy1)
    ctx.closePath()
    ctx.fill()
  }

  ctx.restore()
}

// ── Brush pen: pressure-sensitive width ────────────────────────────────────────
function drawBrushStroke(ctx, stroke) {
  const { points, color, size, opacity } = stroke
  if (!points || points.length === 0) return
  if (points.length === 1) {
    ctx.save()
    ctx.globalAlpha = opacity ?? 0.85
    ctx.fillStyle = color
    const r = (points[0].pressure ?? 0.5) * size * 0.6
    ctx.beginPath()
    ctx.arc(points[0].x, points[0].y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
    return
  }

  ctx.save()
  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = opacity ?? 0.85
  ctx.fillStyle = color

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i]
    const p2 = points[i + 1]
    const press1 = p1.pressure ?? 0.5
    const press2 = p2.pressure ?? 0.5
    const w1 = Math.max(0.5, press1 * size)
    const w2 = Math.max(0.5, press2 * size)

    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x)
    const perp = angle + Math.PI / 2

    const dx1 = Math.cos(perp) * w1 / 2
    const dy1 = Math.sin(perp) * w1 / 2
    const dx2 = Math.cos(perp) * w2 / 2
    const dy2 = Math.sin(perp) * w2 / 2

    ctx.beginPath()
    ctx.moveTo(p1.x + dx1, p1.y + dy1)
    ctx.lineTo(p2.x + dx2, p2.y + dy2)
    ctx.lineTo(p2.x - dx2, p2.y - dy2)
    ctx.lineTo(p1.x - dx1, p1.y - dy1)
    ctx.closePath()
    ctx.fill()
  }

  ctx.restore()
}

// ── Shape stroke renderer ──────────────────────────────────────────────────────
function drawShape(ctx, stroke) {
  const { shapeType, color, size, start, end } = stroke
  if (!start || !end) return
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = size
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = 1
  if (shapeType === 'line') {
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()
  } else if (shapeType === 'rect') {
    ctx.beginPath()
    ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y)
    ctx.stroke()
  } else if (shapeType === 'circle') {
    const rx = Math.abs(end.x - start.x) / 2
    const ry = Math.abs(end.y - start.y) / 2
    const cx = (start.x + end.x) / 2
    const cy = (start.y + end.y) / 2
    ctx.beginPath()
    ctx.ellipse(cx, cy, Math.max(rx, 1), Math.max(ry, 1), 0, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.restore()
}

// ── Public API ─────────────────────────────────────────────────────────────────
export function drawStroke(ctx, stroke) {
  if (stroke.tool === 'shape' || stroke.shapeType) {
    drawShape(ctx, stroke)
    return
  }
  const penType = stroke.penType ?? stroke.tool
  if (penType === 'fountain') {
    drawFountainStroke(ctx, stroke)
  } else if (penType === 'brush') {
    drawBrushStroke(ctx, stroke)
  } else {
    drawSmoothStroke(ctx, stroke)
  }
}

export function renderAllStrokes(ctx, strokes) {
  if (!strokes) return
  strokes.forEach(s => drawStroke(ctx, s))
}

export function renderTextElements(ctx, textElements) {
  if (!textElements) return
  textElements.forEach(el => {
    ctx.save()
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = el.color ?? '#000000'
    const fs = el.fontSize ?? 18
    ctx.font = `${el.bold ? 'bold ' : ''}${el.italic ? 'italic ' : ''}${fs}px ${el.fontFamily ?? 'sans-serif'}`
    const lines = (el.text ?? '').split('\n')
    lines.forEach((line, i) => {
      ctx.fillText(line, el.x, el.y + i * fs * 1.45)
    })
    ctx.restore()
  })
}
