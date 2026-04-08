import styles from './PageSettings.module.css'

const PAPER_TYPES = [
  { id: 'lined',      label: 'Lined',       desc: 'Horizontal rule lines' },
  { id: 'unlined',    label: 'Blank',        desc: 'Clean blank paper' },
  { id: 'dotgrid',    label: 'Dot Grid',     desc: 'Subtle dot grid' },
  { id: 'whiteboard', label: 'Whiteboard',   desc: 'Extra large canvas' },
]

const PAPER_COLORS = [
  { id: 'white', label: 'White',    hex: '#FFFFFF' },
  { id: 'black', label: 'Dark',     hex: '#1a1a1a' },
  { id: 'beige', label: 'Warm Tan', hex: '#F5E6C8' },
]

const LINE_SPACINGS = [
  { value: 20, label: 'Narrow',  desc: '5mm' },
  { value: 28, label: 'College', desc: '7mm' },
  { value: 32, label: 'Medium',  desc: '8mm' },
  { value: 40, label: 'Wide',    desc: '10mm' },
  { value: 52, label: 'Jumbo',   desc: '13mm' },
]

// SVG icons for paper types
function LinedIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="2" y="2" width="28" height="28" rx="3" fill="var(--gray-100)" stroke="var(--gray-300)" strokeWidth="1" />
      {[8,13,18,23].map(y => (
        <line key={y} x1="5" y1={y} x2="27" y2={y} stroke="var(--blue-light)" strokeWidth="1.2" />
      ))}
    </svg>
  )
}
function BlankIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="2" y="2" width="28" height="28" rx="3" fill="var(--gray-100)" stroke="var(--gray-300)" strokeWidth="1" />
    </svg>
  )
}
function DotGridIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="2" y="2" width="28" height="28" rx="3" fill="var(--gray-100)" stroke="var(--gray-300)" strokeWidth="1" />
      {[9,16,23].flatMap(y => [9,16,23].map(x => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.2" fill="var(--blue-medium)" opacity="0.5" />
      )))}
    </svg>
  )
}
function WhiteboardIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="2" y="2" width="28" height="28" rx="3" fill="var(--gray-100)" stroke="var(--gray-300)" strokeWidth="1" />
      {[8,16,24].map(x => (
        <line key={`v${x}`} x1={x} y1="4" x2={x} y2="28" stroke="var(--gray-200)" strokeWidth="1" />
      ))}
      {[8,16,24].map(y => (
        <line key={`h${y}`} x1="4" y1={y} x2="28" y2={y} stroke="var(--gray-200)" strokeWidth="1" />
      ))}
    </svg>
  )
}

const PAPER_TYPE_ICONS = {
  lined: LinedIcon,
  unlined: BlankIcon,
  dotgrid: DotGridIcon,
  whiteboard: WhiteboardIcon,
}

export default function PageSettings({ page, onUpdate, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        <div className={styles.panelHeader}>
          <h2 className={styles.title}>Page Settings</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="14" y1="2" x2="2" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Paper type */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Paper Type</h3>
          <div className={styles.typeGrid}>
            {PAPER_TYPES.map(pt => {
              const Icon = PAPER_TYPE_ICONS[pt.id]
              return (
                <button
                  key={pt.id}
                  className={`${styles.typeCard} ${page.paperType === pt.id ? styles.typeCardActive : ''}`}
                  onClick={() => onUpdate({ paperType: pt.id })}
                >
                  <span className={styles.typeIcon}>{Icon && <Icon />}</span>
                  <span className={styles.typeLabel}>{pt.label}</span>
                  <span className={styles.typeDesc}>{pt.desc}</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* Paper color */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Paper Color</h3>
          <div className={styles.colorRow}>
            {PAPER_COLORS.map(pc => (
              <button
                key={pc.id}
                className={`${styles.colorCard} ${page.paperColor === pc.id ? styles.colorCardActive : ''}`}
                onClick={() => onUpdate({ paperColor: pc.id })}
              >
                <span
                  className={styles.colorSwatch}
                  style={{
                    background: pc.hex,
                    border: pc.id === 'white' ? '1.5px solid var(--gray-300)' : undefined,
                  }}
                />
                <span className={styles.colorLabel}>{pc.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Line spacing */}
        {(page.paperType === 'lined' || page.paperType === 'dotgrid') && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Line / Dot Spacing</h3>
            <div className={styles.spacingRow}>
              {LINE_SPACINGS.map(ls => (
                <button
                  key={ls.value}
                  className={`${styles.spacingBtn} ${page.lineSpacing === ls.value ? styles.spacingBtnActive : ''}`}
                  onClick={() => onUpdate({ lineSpacing: ls.value })}
                >
                  <span className={styles.spacingLabel}>{ls.label}</span>
                  <span className={styles.spacingDesc}>{ls.desc}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        <div className={styles.footer}>
          <button className={styles.doneBtn} onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  )
}
