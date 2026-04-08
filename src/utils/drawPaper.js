export const PAPER_COLORS = {
  white: '#FFFFFF',
  black: '#1a1a1a',
  beige: '#F5E6C8',
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
