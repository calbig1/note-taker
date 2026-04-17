export const PAPER_COLORS = {
  white:  '#FFFFFF',
  black:  '#1a1a1a',
  beige:  '#F5E6C8',
  blue:   '#EEF2FF',
  green:  '#ECFDF5',
  yellow: '#FEFCE8',
}

export const LINE_COLORS = {
  white: 'rgba(180, 195, 220, 0.6)',
  black: 'rgba(80, 100, 120, 0.5)',
  beige: 'rgba(180, 155, 110, 0.5)',
}

export const DOT_COLORS = {
  white: 'rgba(150, 170, 200, 0.7)',
  black: 'rgba(90, 110, 130, 0.6)',
  beige: 'rgba(160, 135, 95, 0.6)',
}

export const MARGIN_COLORS = {
  white: 'rgba(255, 150, 150, 0.4)',
  black: 'rgba(180, 80, 80, 0.3)',
  beige: 'rgba(200, 120, 100, 0.4)',
}

export function drawPaper(ctx, page, canvasWidth, canvasHeight) {
  const { paperType, paperColor, lineSpacing } = page
  const bgColor = PAPER_COLORS[paperColor] ?? '#FFFFFF'

  // Fill background
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  if (paperType === 'lined') {
    drawLinedPaper(ctx, paperColor, lineSpacing, canvasWidth, canvasHeight)
  } else if (paperType === 'dotgrid') {
    drawDotGrid(ctx, paperColor, lineSpacing, canvasWidth, canvasHeight)
  } else if (paperType === 'whiteboard') {
    drawWhiteboardPaper(ctx, paperColor, canvasWidth, canvasHeight)
  } else if (paperType === 'cornell') {
    drawCornellPaper(ctx, paperColor, lineSpacing, canvasWidth, canvasHeight)
  } else if (paperType === 'musicstaff') {
    drawMusicStaff(ctx, paperColor, lineSpacing, canvasWidth, canvasHeight)
  } else if (paperType === 'plannerday') {
    drawPlannerDay(ctx, paperColor, canvasWidth, canvasHeight)
  } else if (paperType === 'isometric') {
    drawIsometricGrid(ctx, paperColor, canvasWidth, canvasHeight)
  }
  // 'unlined' = just the fill, nothing else
}

function drawLinedPaper(ctx, paperColor, lineSpacing, w, h) {
  const lineColor = LINE_COLORS[paperColor] ?? LINE_COLORS.white
  const marginColor = MARGIN_COLORS[paperColor] ?? MARGIN_COLORS.white
  const marginX = 72

  ctx.lineWidth = 1

  // Horizontal lines
  ctx.strokeStyle = lineColor
  ctx.beginPath()
  for (let y = lineSpacing * 2; y < h; y += lineSpacing) {
    ctx.moveTo(0, y + 0.5)
    ctx.lineTo(w, y + 0.5)
  }
  ctx.stroke()

  // Left margin line
  ctx.strokeStyle = marginColor
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(marginX + 0.5, 0)
  ctx.lineTo(marginX + 0.5, h)
  ctx.stroke()

  // Hole punches (decorative)
  ctx.fillStyle = paperColor === 'white'
    ? 'rgba(220, 225, 235, 0.8)'
    : paperColor === 'black'
      ? 'rgba(40, 45, 55, 0.8)'
      : 'rgba(210, 190, 155, 0.8)'
  const holeX = 28
  const holePositions = [h * 0.25, h * 0.5, h * 0.75]
  holePositions.forEach(y => {
    ctx.beginPath()
    ctx.arc(holeX, y, 10, 0, Math.PI * 2)
    ctx.fill()
  })
}

function drawDotGrid(ctx, paperColor, spacing, w, h) {
  const dotColor = DOT_COLORS[paperColor] ?? DOT_COLORS.white

  ctx.fillStyle = dotColor
  for (let y = spacing; y < h; y += spacing) {
    for (let x = spacing; x < w; x += spacing) {
      ctx.beginPath()
      ctx.arc(x, y, 1.5, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

function drawCornellPaper(ctx, paperColor, lineSpacing, w, h) {
  const lineColor = LINE_COLORS[paperColor] ?? LINE_COLORS.white
  const marginColor = MARGIN_COLORS[paperColor] ?? MARGIN_COLORS.white
  const spacing = lineSpacing || 32
  const cueCol = 200  // cue column width
  const summaryRow = h - 180  // summary area height from bottom

  // Horizontal lines (main area)
  ctx.strokeStyle = lineColor
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let y = spacing * 3; y < summaryRow; y += spacing) {
    ctx.moveTo(0, y + 0.5)
    ctx.lineTo(w, y + 0.5)
  }
  ctx.stroke()

  // Cue column vertical line
  ctx.strokeStyle = marginColor
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(cueCol + 0.5, 0)
  ctx.lineTo(cueCol + 0.5, summaryRow)
  ctx.stroke()

  // Summary area horizontal line
  ctx.beginPath()
  ctx.moveTo(0, summaryRow + 0.5)
  ctx.lineTo(w, summaryRow + 0.5)
  ctx.stroke()

  // Labels
  ctx.fillStyle = lineColor
  ctx.font = '14px -apple-system, sans-serif'
  ctx.fillText('Cue / Keywords', 12, spacing * 2)
  ctx.fillText('Notes', cueCol + 16, spacing * 2)
  ctx.fillText('Summary', 16, summaryRow + 24)
}

function drawMusicStaff(ctx, paperColor, lineSpacing, w, h) {
  const lineColor = LINE_COLORS[paperColor] ?? LINE_COLORS.white
  const staffSpacing = 8  // px between staff lines
  const staffGap = 60  // px between staves
  const startY = 60
  const margin = 40

  ctx.strokeStyle = lineColor
  ctx.lineWidth = 1.2
  ctx.beginPath()
  let y = startY
  while (y + staffSpacing * 4 < h - margin) {
    for (let i = 0; i < 5; i++) {
      ctx.moveTo(margin, y + i * staffSpacing + 0.5)
      ctx.lineTo(w - margin, y + i * staffSpacing + 0.5)
    }
    y += staffSpacing * 4 + staffGap
  }
  ctx.stroke()
}

function drawPlannerDay(ctx, paperColor, w, h) {
  const lineColor = LINE_COLORS[paperColor] ?? LINE_COLORS.white
  const marginColor = MARGIN_COLORS[paperColor] ?? MARGIN_COLORS.white
  const headerH = 80
  const timeCol = 90
  const lineSpacing = 44

  // Header area border
  ctx.strokeStyle = lineColor
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(0, headerH + 0.5)
  ctx.lineTo(w, headerH + 0.5)
  ctx.stroke()

  // Time column
  ctx.strokeStyle = marginColor
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(timeCol + 0.5, headerH)
  ctx.lineTo(timeCol + 0.5, h)
  ctx.stroke()

  // Divider in middle
  ctx.strokeStyle = lineColor
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(w / 2 + 0.5, headerH)
  ctx.lineTo(w / 2 + 0.5, h)
  ctx.stroke()

  // Hour lines
  ctx.beginPath()
  for (let y = headerH + lineSpacing; y < h; y += lineSpacing) {
    ctx.moveTo(0, y + 0.5)
    ctx.lineTo(w, y + 0.5)
  }
  ctx.stroke()

  // Time labels
  ctx.fillStyle = lineColor
  ctx.font = '11px -apple-system, sans-serif'
  const startHour = 7
  for (let i = 0; i * lineSpacing + headerH + lineSpacing < h; i++) {
    const hour = (startHour + i) % 24
    const label = hour < 12 ? `${hour === 0 ? 12 : hour} AM` : `${hour === 12 ? 12 : hour - 12} PM`
    ctx.fillText(label, 6, headerH + (i + 1) * lineSpacing - 4)
  }
}

function drawIsometricGrid(ctx, paperColor, w, h) {
  const dotColor = DOT_COLORS[paperColor] ?? DOT_COLORS.white
  const spacing = 24
  const rowHeight = spacing * Math.sin(Math.PI / 3)

  ctx.fillStyle = dotColor
  for (let row = 0; row * rowHeight < h + spacing; row++) {
    const offsetX = (row % 2) * (spacing / 2)
    const y = row * rowHeight
    for (let x = offsetX; x < w + spacing; x += spacing) {
      ctx.beginPath()
      ctx.arc(x, y, 1.5, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

function drawWhiteboardPaper(ctx, paperColor, w, h) {
  // Subtle grid for whiteboard
  const color = paperColor === 'black'
    ? 'rgba(70, 80, 95, 0.3)'
    : paperColor === 'beige'
      ? 'rgba(170, 145, 105, 0.2)'
      : 'rgba(200, 210, 225, 0.3)'

  const spacing = 40
  ctx.strokeStyle = color
  ctx.lineWidth = 0.5
  ctx.beginPath()
  for (let x = spacing; x < w; x += spacing) {
    ctx.moveTo(x + 0.5, 0)
    ctx.lineTo(x + 0.5, h)
  }
  for (let y = spacing; y < h; y += spacing) {
    ctx.moveTo(0, y + 0.5)
    ctx.lineTo(w, y + 0.5)
  }
  ctx.stroke()
}
