import styles from './PageSettings.module.css'

const PAPER_TYPES = [
  { id: 'lined',      label: 'Lined',       desc: 'Horizontal rule lines' },
  { id: 'unlined',    label: 'Blank',        desc: 'Clean blank paper' },
  { id: 'dotgrid',    label: 'Dot Grid',     desc: 'Subtle dot grid' },
  { id: 'whiteboard', label: 'Whiteboard',   desc: 'Extra large canvas' },
  { id: 'cornell',    label: 'Cornell',      desc: 'Cornell note layout' },
  { id: 'musicstaff', label: 'Music',        desc: '5-line music staff' },
  { id: 'plannerday', label: 'Planner',      desc: 'Daily planner grid' },
  { id: 'isometric',  label: 'Isometric',   desc: 'Isometric dot grid' },
]

const PAPER_COLORS = [
  { id: 'white',  label: 'White',      hex: '#FFFFFF' },
  { id: 'black',  label: 'Dark',       hex: '#1a1a1a' },
  { id: 'beige',  label: 'Warm Tan',   hex: '#F5E6C8' },
  { id: 'blue',   label: 'Blue Tint',  hex: '#EEF2FF' },
  { id: 'green',  label: 'Green Tint', hex: '#ECFDF5' },
  { id: 'yellow', label: 'Yellow',     hex: '#FEFCE8' },
]

const LINE_SPACINGS = [
  { value: 20, label: 'Narrow',  desc: '5mm' },
  { value: 28, label: 'College', desc: '7mm' },
  { value: 32, label: 'Medium',  desc: '8mm' },
  { value: 40, label: 'Wide',    desc: '10mm' },
  { value: 52, label: 'Jumbo',   desc: '13mm' },
]

function PaperPreviewIcon({ type }) {
  const baseStyle = { rx: 2, fill: '#f7f7f9', stroke: '#d0d0e0', strokeWidth: 1 }
  switch (type) {
    case 'lined':
      return <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="2" y="2" width="32" height="32" {...baseStyle}/>
        {[9,14,19,24,29].map(y => <line key={y} x1="5" y1={y} x2="31" y2={y} stroke="#a5b4fc" strokeWidth="1.2"/>)}
      </svg>
    case 'unlined':
      return <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="2" y="2" width="32" height="32" {...baseStyle}/>
      </svg>
    case 'dotgrid':
      return <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="2" y="2" width="32" height="32" {...baseStyle}/>
        {[9,16,23,30].flatMap(y => [9,16,23,30].map(x =>
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.2" fill="#818cf8" opacity="0.6"/>
        ))}
      </svg>
    case 'whiteboard':
      return <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="2" y="2" width="32" height="32" {...baseStyle}/>
        {[9,18,27].map(x => <line key={`v${x}`} x1={x} y1="3" x2={x} y2="33" stroke="#e2e8f0" strokeWidth="1"/>)}
        {[9,18,27].map(y => <line key={`h${y}`} x1="3" y1={y} x2="33" y2={y} stroke="#e2e8f0" strokeWidth="1"/>)}
      </svg>
    case 'cornell':
      return <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="2" y="2" width="32" height="32" {...baseStyle}/>
        <line x1="11" y1="2" x2="11" y2="28" stroke="#a5b4fc" strokeWidth="1.5"/>
        <line x1="2" y1="28" x2="34" y2="28" stroke="#a5b4fc" strokeWidth="1.5"/>
        {[8,13,18,23].map(y => <line key={y} x1="13" y1={y} x2="32" y2={y} stroke="#a5b4fc" strokeWidth="0.8"/>)}
      </svg>
    case 'musicstaff':
      return <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="2" y="2" width="32" height="32" {...baseStyle}/>
        {[7,10,13,16,19].map(y => <line key={y} x1="5" y1={y} x2="31" y2={y} stroke="#a5b4fc" strokeWidth="1.2"/>)}
        {[24,27,30,33].map(y => <line key={y} x1="5" y1={y} x2="31" y2={y} stroke="#a5b4fc" strokeWidth="1.2"/>)}
      </svg>
    case 'plannerday':
      return <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="2" y="2" width="32" height="32" {...baseStyle}/>
        <rect x="2" y="2" width="32" height="6" rx="1" fill="#a5b4fc" opacity="0.3"/>
        {[12,17,22,27].map(y => <line key={y} x1="5" y1={y} x2="31" y2={y} stroke="#a5b4fc" strokeWidth="0.9"/>)}
        <line x1="17" y1="8" x2="17" y2="33" stroke="#c7d2fe" strokeWidth="1"/>
      </svg>
    case 'isometric':
      return <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="2" y="2" width="32" height="32" {...baseStyle}/>
        {[-10,-4,2,8,14,20,26,32,38].map(y =>
          <line key={`d1-${y}`} x1="2" y1={y} x2="34" y2={y+18} stroke="#818cf8" strokeWidth="0.7" opacity="0.5"/>
        )}
        {[-10,-4,2,8,14,20,26,32,38].map(y =>
          <line key={`d2-${y}`} x1="34" y1={y} x2="2" y2={y+18} stroke="#818cf8" strokeWidth="0.7" opacity="0.5"/>
        )}
      </svg>
    default:
      return <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="2" y="2" width="32" height="32" {...baseStyle}/>
      </svg>
  }
}

export default function PageSettings({ page, onUpdate, onClose }) {
  const showSpacing = page.paperType === 'lined' || page.paperType === 'dotgrid' ||
    page.paperType === 'cornell' || page.paperType === 'musicstaff' || page.paperType === 'plannerday'

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        <div className={styles.panelHeader}>
          <h2 className={styles.title}>Page Settings</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="14" y1="2" x2="2" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Paper type */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Paper Type</h3>
          <div className={styles.typeGrid}>
            {PAPER_TYPES.map(pt => (
              <button
                key={pt.id}
                className={`${styles.typeCard} ${page.paperType === pt.id ? styles.typeCardActive : ''}`}
                onClick={() => onUpdate({ paperType: pt.id })}
              >
                <span className={styles.typeIcon}><PaperPreviewIcon type={pt.id} /></span>
                <span className={styles.typeLabel}>{pt.label}</span>
                <span className={styles.typeDesc}>{pt.desc}</span>
              </button>
            ))}
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
                    border: (pc.id === 'white' || pc.id === 'blue' || pc.id === 'green' || pc.id === 'yellow')
                      ? '1.5px solid var(--border)' : undefined,
                  }}
                />
                <span className={styles.colorLabel}>{pc.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Line spacing */}
        {showSpacing && (
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
