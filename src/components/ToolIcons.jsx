// Completely redesigned icons — bold, filled, distinctive silhouettes

export function PenIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="10" y="2" width="4" height="2.5" rx="1.25" fill={color} opacity="0.55"/>
      <path d="M9.5 4.5h5V14l-2.5 4.5L9.5 14V4.5z" fill={color}/>
      <path d="M11.5 18.5L12 21.5l.5-3" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="22" r="0.7" fill={color}/>
      <rect x="10.8" y="5" width="1.2" height="8" rx="0.6" fill="white" opacity="0.2"/>
    </svg>
  )
}

export function FountainPenIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 2h10l2 5H5L7 2z" fill={color} opacity="0.6"/>
      <path d="M5 7h14v8l-7 7-7-7V7z" fill={color}/>
      <path d="M10.5 22 L12 24 L13.5 22" fill={color} opacity="0.9"/>
      <line x1="12" y1="22" x2="11" y2="24" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="12" y1="22" x2="13" y2="24" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="5" y1="10" x2="19" y2="10" stroke="white" strokeWidth="1" opacity="0.2"/>
      <rect x="10.5" y="7" width="1.5" height="7" rx="0.75" fill="white" opacity="0.12"/>
    </svg>
  )
}

export function BrushIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="10.5" y="2" width="3" height="9" rx="1.5" fill={color}/>
      <path d="M8 11 Q12 13.5 16 11 Q17 14 15 16.5 Q13.5 18.5 12 19.5 Q10.5 18.5 9 16.5 Q7 14 8 11Z" fill={color}/>
      <ellipse cx="12" cy="21" rx="1.8" ry="1.2" fill={color} opacity="0.75"/>
      <rect x="11.2" y="3" width="1" height="7" rx="0.5" fill="white" opacity="0.25"/>
    </svg>
  )
}

export function PencilIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="9.5" y="2" width="5" height="2.5" rx="1" fill="#E87070"/>
      <rect x="9.5" y="4.5" width="5" height="2" fill={color} opacity="0.35"/>
      <rect x="9.5" y="6.5" width="5" height="11" fill="#F6C94E"/>
      <line x1="9.5" y1="6.5" x2="9.5" y2="17.5" stroke={color} strokeWidth="0.6" opacity="0.2"/>
      <line x1="14.5" y1="6.5" x2="14.5" y2="17.5" stroke={color} strokeWidth="0.6" opacity="0.2"/>
      <path d="M9.5 17.5 L12 22 L14.5 17.5Z" fill="#D9A84B"/>
      <path d="M11 20 L12 22.5 L13 20Z" fill={color} opacity="0.8"/>
      <line x1="10.8" y1="8" x2="10.8" y2="16" stroke="white" strokeWidth="0.8" opacity="0.35"/>
    </svg>
  )
}

export function HighlighterIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 4 L20 4 L20 7 L4 7 Z" fill={color} opacity="0.55" rx="1"/>
      <path d="M4 7 L20 7 L18 16 L6 16 Z" fill={color} opacity="0.9"/>
      <path d="M6 16 L8 21 L16 21 L18 16 Z" fill={color}/>
      <line x1="8" y1="21" x2="16" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <rect x="5.5" y="8" width="2" height="7" rx="1" fill="white" opacity="0.15"/>
    </svg>
  )
}

export function EraserIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="8" width="20" height="11" rx="2.5" fill="#FFACB7"/>
      <rect x="2" y="8" width="8" height="11" rx="2.5" fill="#E8637A"/>
      <rect x="2" y="13" width="20" height="1" fill="white" opacity="0.2"/>
      <line x1="4" y1="21" x2="20" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>
      <line x1="2" y1="19" x2="10" y2="19" stroke="white" strokeWidth="0.7" opacity="0.4"/>
    </svg>
  )
}

export function SelectionIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="15" height="15" rx="1.5" stroke={color} strokeWidth="1.8" strokeDasharray="3.5 2.5" fill="none"/>
      <circle cx="3" cy="3" r="1.5" fill={color}/>
      <circle cx="18" cy="3" r="1.5" fill={color}/>
      <circle cx="3" cy="18" r="1.5" fill={color}/>
      <circle cx="18" cy="18" r="1.5" fill={color}/>
      <path d="M18 14 L22 20" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  )
}

export function LassoIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3 C7 3 3 6.5 3 11 C3 15.5 7 18 12 18 C15 18 17.5 16.5 18.5 14.5 C19.5 12.5 19 10 17 9"
        stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 2" fill="none"
      />
      <path d="M14 18 L12 22" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M14 18 L16 21" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="17" cy="9" r="1.5" fill={color}/>
    </svg>
  )
}

export function TextIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="4" fill={color} opacity="0.12"/>
      <text x="12" y="17" textAnchor="middle" fontSize="14" fontWeight="800" fontFamily="serif" fill={color}>T</text>
    </svg>
  )
}

export function ShapeToolIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="12" width="9" height="8" rx="1.5" stroke={color} strokeWidth="1.7" fill={color} fillOpacity="0.12"/>
      <circle cx="17" cy="7" r="4.5" stroke={color} strokeWidth="1.7" fill={color} fillOpacity="0.12"/>
      <line x1="2.5" y1="5" x2="9.5" y2="10" stroke={color} strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  )
}

export function HandScrollIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M8.5 4 C8.5 3.2 9.1 2.5 10 2.5 C10.9 2.5 11.5 3.2 11.5 4 L11.5 11
           M11.5 8.5 C11.5 7.7 12.1 7 13 7 C13.9 7 14.5 7.7 14.5 8.5 L14.5 11
           M14.5 9.5 C14.5 8.7 15.1 8 16 8 C16.9 8 17.5 8.7 17.5 9.5 L17.5 15
           C17.5 19 14.5 21.5 11.5 21.5 L10 21.5
           C7 21.5 5 19 5 16 L5 13.5
           C5 12.5 5.7 12 6.5 12 C6.5 12 7.5 12 7.5 13 L7.5 14
           L8.5 14 L8.5 4"
        stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
    </svg>
  )
}

export function UndoIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 10 A9 9 0 1 1 7 19" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
      <polyline points="3,5 3,10 8,10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  )
}

export function RedoIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M21 10 A9 9 0 1 0 17 19" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
      <polyline points="21,5 21,10 16,10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  )
}

export function PlusIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  )
}

export function BackIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M11 6 L5 12 L11 18" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <line x1="5" y1="12" x2="20" y2="12" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  )
}

export function ExportIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 16 L4 19 Q4 20 5 20 L19 20 Q20 20 20 19 L20 16" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <line x1="12" y1="3" x2="12" y2="15" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <polyline points="7.5,8.5 12,3 16.5,8.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  )
}

export function SettingsIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <line x1="3" y1="6" x2="21" y2="6" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="3" y1="18" x2="21" y2="18" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="8" cy="6" r="2.5" fill="var(--bg-base,#1A1A26)" stroke={color} strokeWidth="1.8"/>
      <circle cx="16" cy="12" r="2.5" fill="var(--bg-base,#1A1A26)" stroke={color} strokeWidth="1.8"/>
      <circle cx="9" cy="18" r="2.5" fill="var(--bg-base,#1A1A26)" stroke={color} strokeWidth="1.8"/>
    </svg>
  )
}

export function NotebookIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="2" width="16" height="20" rx="2.5" fill={color} opacity="0.12" stroke={color} strokeWidth="1.5"/>
      <rect x="4" y="2" width="4" height="20" rx="2" fill={color} opacity="0.35"/>
      <line x1="10" y1="7" x2="18" y2="7" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.7"/>
      <line x1="10" y1="11" x2="18" y2="11" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.7"/>
      <line x1="10" y1="15" x2="15" y2="15" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.7"/>
    </svg>
  )
}

export function ZoomInIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="10" cy="10" r="7" stroke={color} strokeWidth="1.8" fill="none"/>
      <line x1="15.5" y1="15.5" x2="21" y2="21" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="7" y1="10" x2="13" y2="10" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="10" y1="7" x2="10" y2="13" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

export function ZoomOutIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="10" cy="10" r="7" stroke={color} strokeWidth="1.8" fill="none"/>
      <line x1="15.5" y1="15.5" x2="21" y2="21" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="7" y1="10" x2="13" y2="10" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

export function TrashIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 7 H20" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M10 3 H14 Q15 3 15 4 L15 7 H9 L9 4 Q9 3 10 3Z" fill={color} opacity="0.5"/>
      <path d="M6 7 L7 20 Q7 21 8.5 21 H15.5 Q17 21 17 20 L18 7" stroke={color} strokeWidth="1.7" strokeLinecap="round" fill="none"/>
      <line x1="10" y1="11" x2="10" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="14" y1="11" x2="14" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function DotsIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="5" cy="12" r="2" fill={color}/>
      <circle cx="12" cy="12" r="2" fill={color}/>
      <circle cx="19" cy="12" r="2" fill={color}/>
    </svg>
  )
}

export function PageIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 2 L15 2 L19 6 L19 22 L5 22 Z" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M15 2 L15 6 L19 6" stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      <line x1="8" y1="10" x2="16" y2="10" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.65"/>
      <line x1="8" y1="13.5" x2="16" y2="13.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.65"/>
      <line x1="8" y1="17" x2="13" y2="17" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.65"/>
    </svg>
  )
}

export function SearchIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="10.5" cy="10.5" r="6.5" stroke={color} strokeWidth="1.8" fill="none"/>
      <line x1="15.5" y1="15.5" x2="21" y2="21" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  )
}

export function ChevronLeftIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M15 18 L9 12 L15 6" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function ChevronRightIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 18 L15 12 L9 6" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function WristGuardIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="9" width="20" height="9" rx="4.5" stroke={color} strokeWidth="1.7" fill={color} fillOpacity="0.1"/>
      <path d="M10 6 Q12 4 14 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <line x1="8" y1="13.5" x2="16" y2="13.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
    </svg>
  )
}

export function RectShapeIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="6" width="18" height="12" rx="2" stroke={color} strokeWidth="1.8" fill={color} fillOpacity="0.1"/>
    </svg>
  )
}

export function CircleShapeIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="12" rx="9" ry="7" stroke={color} strokeWidth="1.8" fill={color} fillOpacity="0.1"/>
    </svg>
  )
}

export function LineShapeIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <line x1="4" y1="20" x2="20" y2="4" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  )
}

export function TriangleShapeIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 4 L21 20 L3 20 Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill={color} fillOpacity="0.1"/>
    </svg>
  )
}

// ── NEW ICONS ─────────────────────────────────────────────────────────────

export function StarIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2 L14.9 8.6 L22 9.3 L17 14 L18.5 21 L12 17.6 L5.5 21 L7 14 L2 9.3 L9.1 8.6 Z"
        stroke={color} strokeWidth="1.7" strokeLinejoin="round" fill="none"/>
    </svg>
  )
}

export function StarFilledIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2 L14.9 8.6 L22 9.3 L17 14 L18.5 21 L12 17.6 L5.5 21 L7 14 L2 9.3 L9.1 8.6 Z"
        fill={color} strokeLinejoin="round"/>
    </svg>
  )
}

export function ClockIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" fill="none"/>
      <path d="M12 7 L12 12.5 L16 15" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function ZapIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M13 2 L5 13 L11 13 L11 22 L19 11 L13 11 Z" fill={color} opacity="0.9" stroke={color} strokeWidth="0.5" strokeLinejoin="round"/>
    </svg>
  )
}

export function GridIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="9" height="9" rx="2" fill={color} opacity="0.7"/>
      <rect x="13" y="2" width="9" height="9" rx="2" fill={color} opacity="0.7"/>
      <rect x="2" y="13" width="9" height="9" rx="2" fill={color} opacity="0.7"/>
      <rect x="13" y="13" width="9" height="9" rx="2" fill={color} opacity="0.7"/>
    </svg>
  )
}

export function SunIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" fill={color}/>
      <line x1="12" y1="2" x2="12" y2="5" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="12" y1="19" x2="12" y2="22" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="2" y1="12" x2="5" y2="12" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="19" y1="12" x2="22" y2="12" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="4.9" y1="4.9" x2="7.1" y2="7.1" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="16.9" y1="16.9" x2="19.1" y2="19.1" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="19.1" y1="4.9" x2="16.9" y2="7.1" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="7.1" y1="16.9" x2="4.9" y2="19.1" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

export function MoonIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M21 12.9 A9 9 0 1 1 11.1 3 A7 7 0 0 0 21 12.9Z" fill={color} opacity="0.9"/>
    </svg>
  )
}

export function KeyboardIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="6" width="20" height="13" rx="2.5" stroke={color} strokeWidth="1.7" fill="none"/>
      <rect x="5" y="9.5" width="2.5" height="2" rx="0.6" fill={color} opacity="0.7"/>
      <rect x="9" y="9.5" width="2.5" height="2" rx="0.6" fill={color} opacity="0.7"/>
      <rect x="13" y="9.5" width="2.5" height="2" rx="0.6" fill={color} opacity="0.7"/>
      <rect x="17" y="9.5" width="2.5" height="2" rx="0.6" fill={color} opacity="0.7"/>
      <rect x="7" y="13" width="10" height="2" rx="0.8" fill={color} opacity="0.7"/>
    </svg>
  )
}

export function ImageIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" rx="2.5" stroke={color} strokeWidth="1.7" fill="none"/>
      <circle cx="8.5" cy="9.5" r="2" fill={color} opacity="0.7"/>
      <path d="M2 16 L7 11 L11 15 L15 10 L22 16" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function TagIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 3 H12 L21 12 L12 21 L3 12 Z" stroke={color} strokeWidth="1.7" strokeLinejoin="round" fill={color} fillOpacity="0.1"/>
      <circle cx="8" cy="8" r="1.8" fill={color}/>
    </svg>
  )
}

export function LayersIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2 L22 8 L12 14 L2 8 Z" stroke={color} strokeWidth="1.7" strokeLinejoin="round" fill={color} fillOpacity="0.1"/>
      <path d="M2 12 L12 18 L22 12" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M2 16 L12 22 L22 16" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  )
}
