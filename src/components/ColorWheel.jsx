import { useRef, useEffect, useState, useCallback } from 'react'
import styles from './ColorWheel.module.css'

// ── Color math helpers ────────────────────────────────────────────────────────

function hsvToRgb(h, s, v) {
  const f = n => {
    const k = (n + h / 60) % 6
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1))
  }
  return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)]
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return null
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null
  return [r, g, b]
}

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  const s = max === 0 ? 0 : d / max
  const v = max
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60
    else if (max === g) h = ((b - r) / d + 2) * 60
    else h = ((r - g) / d + 4) * 60
  }
  return [h, s, v]
}

function hexToHsv(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return [0, 1, 1]
  return rgbToHsv(...rgb)
}

// ── Constants ─────────────────────────────────────────────────────────────────

const SIZE = 220
const CENTER = SIZE / 2
const OUTER_R = SIZE / 2 - 4
const INNER_R = OUTER_R - 22
const SQ_HALF = INNER_R * 0.68

const PRESET_COLORS = [
  '#000000', '#FFFFFF', '#EF4444', '#F97316',
  '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6',
  '#EC4899', '#14B8A6', '#6366F1', '#F59E0B',
]

// ── ColorWheel component ──────────────────────────────────────────────────────

export default function ColorWheel({ color, onChange, onClose, recentColors = [] }) {
  const ringRef = useRef(null)
  const squareRef = useRef(null)
  const containerRef = useRef(null)

  const [hsv, setHsv] = useState(() => hexToHsv(color))
  const [hexInput, setHexInput] = useState(color)
  const [dragging, setDragging] = useState(null) // 'ring' | 'square' | null

  const [h, s, v] = hsv

  // Sync hex input when hsv changes internally
  useEffect(() => {
    const [r, g, b] = hsvToRgb(h, s, v)
    const hex = rgbToHex(r, g, b)
    setHexInput(hex)
    onChange(hex)
  }, [h, s, v])

  // ── Draw hue ring ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = ringRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const imageData = ctx.createImageData(SIZE, SIZE)
    const data = imageData.data

    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const dx = x - CENTER
        const dy = y - CENTER
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist > OUTER_R + 1 || dist < INNER_R - 1) {
          data[(y * SIZE + x) * 4 + 3] = 0
          continue
        }

        const hue = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360
        const [r, g, b] = hsvToRgb(hue, 1, 1)

        // Anti-alias edges
        let alpha = 255
        if (dist > OUTER_R) alpha = Math.round(255 * (OUTER_R + 1 - dist))
        if (dist < INNER_R) alpha = Math.round(255 * (dist - INNER_R + 1))

        const i = (y * SIZE + x) * 4
        data[i] = r
        data[i + 1] = g
        data[i + 2] = b
        data[i + 3] = Math.max(0, Math.min(255, alpha))
      }
    }
    ctx.putImageData(imageData, 0, 0)
  }, [])

  // ── Draw SV square ────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = squareRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const sq = SQ_HALF * 2

    ctx.clearRect(0, 0, sq, sq)

    // White → hue
    const [hr, hg, hb] = hsvToRgb(h, 1, 1)
    const grad1 = ctx.createLinearGradient(0, 0, sq, 0)
    grad1.addColorStop(0, '#fff')
    grad1.addColorStop(1, `rgb(${hr},${hg},${hb})`)
    ctx.fillStyle = grad1
    ctx.fillRect(0, 0, sq, sq)

    // Transparent → black (top to bottom)
    const grad2 = ctx.createLinearGradient(0, 0, 0, sq)
    grad2.addColorStop(0, 'rgba(0,0,0,0)')
    grad2.addColorStop(1, 'rgba(0,0,0,1)')
    ctx.fillStyle = grad2
    ctx.fillRect(0, 0, sq, sq)
  }, [h])

  // ── Indicator helpers ──────────────────────────────────────────────────────
  function getRingIndicator() {
    const angle = (h * Math.PI) / 180
    const r = (OUTER_R + INNER_R) / 2
    return {
      x: CENTER + r * Math.cos(angle),
      y: CENTER + r * Math.sin(angle),
    }
  }

  function getSquareIndicator() {
    const sq = SQ_HALF * 2
    return {
      x: CENTER - SQ_HALF + s * sq,
      y: CENTER - SQ_HALF + (1 - v) * sq,
    }
  }

  // ── Hit detection + pointer handling ─────────────────────────────────────
  function getZoneAndValues(clientX, clientY) {
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    const dx = x - CENTER
    const dy = y - CENTER
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist >= INNER_R && dist <= OUTER_R + 4) {
      const hue = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360
      return { zone: 'ring', hue }
    }

    if (
      x >= CENTER - SQ_HALF && x <= CENTER + SQ_HALF &&
      y >= CENTER - SQ_HALF && y <= CENTER + SQ_HALF
    ) {
      const sq = SQ_HALF * 2
      const newS = Math.max(0, Math.min(1, (x - (CENTER - SQ_HALF)) / sq))
      const newV = Math.max(0, Math.min(1, 1 - (y - (CENTER - SQ_HALF)) / sq))
      return { zone: 'square', s: newS, v: newV }
    }

    return null
  }

  const handlePointerDown = useCallback((e) => {
    e.preventDefault()
    containerRef.current.setPointerCapture(e.pointerId)
    const hit = getZoneAndValues(e.clientX, e.clientY)
    if (!hit) return
    setDragging(hit.zone)
    if (hit.zone === 'ring') {
      setHsv(prev => [hit.hue, prev[1], prev[2]])
    } else {
      setHsv(prev => [prev[0], hit.s, hit.v])
    }
  }, [])

  const handlePointerMove = useCallback((e) => {
    if (!dragging) return
    e.preventDefault()
    const hit = getZoneAndValues(e.clientX, e.clientY)
    if (!hit) return
    if (dragging === 'ring' && hit.zone === 'ring') {
      setHsv(prev => [hit.hue, prev[1], prev[2]])
    } else if (dragging === 'square') {
      // Allow square drag even if pointer moved slightly outside
      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const sq = SQ_HALF * 2
      const newS = Math.max(0, Math.min(1, (x - (CENTER - SQ_HALF)) / sq))
      const newV = Math.max(0, Math.min(1, 1 - (y - (CENTER - SQ_HALF)) / sq))
      setHsv(prev => [prev[0], newS, newV])
    }
  }, [dragging])

  const handlePointerUp = useCallback(() => {
    setDragging(null)
  }, [])

  // ── Hex input ─────────────────────────────────────────────────────────────
  function handleHexChange(e) {
    const val = e.target.value
    setHexInput(val)
    if (/^#[0-9a-fA-F]{6}$/.test(val)) {
      setHsv(hexToHsv(val))
    }
  }

  function handleHexBlur() {
    if (!/^#[0-9a-fA-F]{6}$/.test(hexInput)) {
      const [r, g, b] = hsvToRgb(h, s, v)
      setHexInput(rgbToHex(r, g, b))
    }
  }

  const ringInd = getRingIndicator()
  const sqInd = getSquareIndicator()
  const sq = SQ_HALF * 2

  return (
    <div className={styles.popover} onClick={e => e.stopPropagation()}>
        {/* Wheel */}
        <div
          className={styles.wheelContainer}
          ref={containerRef}
          style={{ width: SIZE, height: SIZE, position: 'relative' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Hue ring */}
          <canvas
            ref={ringRef}
            width={SIZE}
            height={SIZE}
            className={styles.ringCanvas}
          />

          {/* SV square, positioned in center */}
          <canvas
            ref={squareRef}
            width={sq}
            height={sq}
            className={styles.squareCanvas}
            style={{
              position: 'absolute',
              left: CENTER - SQ_HALF,
              top: CENTER - SQ_HALF,
            }}
          />

          {/* Ring indicator */}
          <div
            className={styles.ringIndicator}
            style={{
              left: ringInd.x - 8,
              top: ringInd.y - 8,
            }}
          />

          {/* Square indicator */}
          <div
            className={styles.squareIndicator}
            style={{
              left: sqInd.x - 6,
              top: sqInd.y - 6,
            }}
          />
        </div>

        {/* Hex input row */}
        <div className={styles.hexRow}>
          <div
            className={styles.currentSwatch}
            style={{ background: hexInput }}
          />
          <div className={styles.hexInputWrapper}>
            <span className={styles.hashSymbol}>#</span>
            <input
              className={styles.hexInput}
              value={hexInput.replace('#', '')}
              onChange={e => handleHexChange({ target: { value: '#' + e.target.value } })}
              onBlur={handleHexBlur}
              maxLength={6}
              spellCheck={false}
            />
          </div>
        </div>

        {/* Recent colors */}
        {recentColors.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Recent</div>
            <div className={styles.swatchRow}>
              {recentColors.slice(0, 8).map((c, i) => (
                <button
                  key={i}
                  className={styles.miniSwatch}
                  style={{ background: c, border: c === '#ffffff' || c === '#FFFFFF' ? '1.5px solid var(--gray-300)' : undefined }}
                  onClick={() => {
                    setHsv(hexToHsv(c))
                    setHexInput(c)
                  }}
                  title={c}
                />
              ))}
            </div>
          </div>
        )}

        {/* Preset colors */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Colors</div>
          <div className={styles.swatchGrid}>
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                className={styles.miniSwatch}
                style={{ background: c, border: c === '#FFFFFF' ? '1.5px solid var(--gray-300)' : undefined }}
                onClick={() => {
                  setHsv(hexToHsv(c))
                  setHexInput(c)
                }}
                title={c}
              />
            ))}
          </div>
        </div>
      </div>
  )
}
