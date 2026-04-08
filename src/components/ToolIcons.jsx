// Custom SVG icons — no emojis. Each accepts size (number) and color (string) props.

export function PenIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="2" width="4" height="12" rx="1.5" fill={color} opacity="0.9" />
      <rect x="10.5" y="2" width="3" height="2" rx="0.5" fill={color} opacity="0.6" />
      <polygon points="10,14 14,14 12,19" fill={color} />
      <line x1="12" y1="19" x2="12" y2="21.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="12" cy="21.8" r="0.5" fill={color} />
    </svg>
  )
}

export function FountainPenIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="9.5" y="2" width="5" height="11" rx="2.5" fill={color} opacity="0.85" />
      <rect x="10" y="2" width="4" height="3" rx="1" fill={color} opacity="0.5" />
      <path d="M9.5 13 L12 21 L14.5 13 Z" fill={color} opacity="0.9" />
      <path d="M10.5 16 L12 21 L13.5 16" stroke="white" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="12" y1="21" x2="11" y2="22.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="12" y1="21" x2="13" y2="22.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function BrushIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10.5" y="2" width="3" height="11" rx="1.5" fill={color} opacity="0.9" />
      <path d="M9 13 Q12 16 15 13 L14 16 Q12 20 10 16 Z" fill={color} opacity="0.85" />
      <path d="M10.5 16.5 Q12 19.5 13.5 16.5" stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" />
      <ellipse cx="12" cy="20.5" rx="1.5" ry="1" fill={color} opacity="0.7" />
    </svg>
  )
}

export function PencilIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Eraser top */}
      <rect x="9.5" y="2" width="5" height="3" rx="1" fill="#E87070" />
      <line x1="9.5" y1="5" x2="14.5" y2="5" stroke={color} strokeWidth="0.8" opacity="0.4" />
      {/* Ferrule */}
      <rect x="9.5" y="5" width="5" height="2" rx="0" fill={color} opacity="0.4" />
      {/* Body - hexagonal represented as rect with slight side hints */}
      <rect x="9.5" y="7" width="5" height="11" fill="#F6C94E" />
      <line x1="9.5" y1="7" x2="9.5" y2="18" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <line x1="14.5" y1="7" x2="14.5" y2="18" stroke={color} strokeWidth="0.5" opacity="0.3" />
      {/* Sharpened wood */}
      <path d="M9.5,18 L12,22 L14.5,18 Z" fill="#D4A84B" />
      {/* Graphite tip */}
      <path d="M11,20.5 L12,22.5 L13,20.5 Z" fill={color} opacity="0.85" />
    </svg>
  )
}

export function HighlighterIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cap */}
      <rect x="8" y="2" width="8" height="4" rx="2" fill={color} opacity="0.6" />
      {/* Body - wide flat marker */}
      <rect x="8" y="6" width="8" height="12" rx="1" fill={color} opacity="0.85" />
      <rect x="9" y="7" width="3" height="10" rx="0.5" fill="white" opacity="0.15" />
      {/* Beveled tip */}
      <path d="M8,18 L10,22 L14,22 L16,18 Z" fill={color} opacity="0.9" />
      {/* Highlight stripe on tip */}
      <line x1="10" y1="22" x2="14" y2="22" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  )
}

export function EraserIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Pink Pearl style eraser block */}
      <rect x="3" y="9" width="18" height="10" rx="2" fill="#E8A0B0" />
      <rect x="3" y="9" width="7" height="10" rx="2" fill="#D4607A" />
      {/* Label line on right section */}
      <line x1="12" y1="11" x2="19" y2="11" stroke="white" strokeWidth="0.8" opacity="0.4" />
      <line x1="12" y1="13" x2="19" y2="13" stroke="white" strokeWidth="0.8" opacity="0.4" />
      {/* Erasing marks below */}
      <line x1="5" y1="21" x2="19" y2="21" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
      <line x1="8" y1="19.5" x2="19" y2="19.5" stroke={color} strokeWidth="0.6" opacity="0.2" />
    </svg>
  )
}

export function SelectionIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 4 Q3 8 4 13 Q5 17 9 19 Q13 20 16 17 Q19 14 18 10 Q17 6 13 5 Q9 4 6 4 Z"
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray="2.5 2"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M16 17 L20 21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function UndoIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7 8 Q5 12 8 16 Q11 20 16 19 Q21 18 21 13 Q21 8 16 7 Q13 6.5 11 8"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <polyline points="7,4 7,9 12,9" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

export function RedoIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17 8 Q19 12 16 16 Q13 20 8 19 Q3 18 3 13 Q3 8 8 7 Q11 6.5 13 8"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <polyline points="17,4 17,9 12,9" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

export function PlusIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function BackIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="15,18 9,12 15,6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

export function ExportIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="3" x2="12" y2="15" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <polyline points="8,11 12,15 16,11" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="4" y1="20" x2="20" y2="20" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function SettingsIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8" fill="none" />
      <path
        d="M12 2 L12 5 M12 19 L12 22 M2 12 L5 12 M19 12 L22 12 M4.9 4.9 L7.1 7.1 M16.9 16.9 L19.1 19.1 M19.1 4.9 L16.9 7.1 M7.1 16.9 L4.9 19.1"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function NotebookIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="3" width="14" height="18" rx="2" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
      <line x1="5" y1="3" x2="5" y2="21" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="9" y1="8" x2="17" y2="8" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.7" />
      <line x1="9" y1="12" x2="17" y2="12" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.7" />
      <line x1="9" y1="16" x2="14" y2="16" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}

export function ZoomInIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10.5" cy="10.5" r="6.5" stroke={color} strokeWidth="1.8" fill="none" />
      <line x1="15.5" y1="15.5" x2="21" y2="21" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="10.5" x2="13" y2="10.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="10.5" y1="8" x2="10.5" y2="13" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function ZoomOutIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10.5" cy="10.5" r="6.5" stroke={color} strokeWidth="1.8" fill="none" />
      <line x1="15.5" y1="15.5" x2="21" y2="21" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="10.5" x2="13" y2="10.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function TrashIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="3,6 5,6 21,6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 6 L18 20 Q18 21 17 21 L7 21 Q6 21 6 20 L5 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M9 6 L9 4 Q9 3 10 3 L14 3 Q15 3 15 4 L15 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="10" y1="11" x2="10" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="11" x2="14" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function DotsIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="5" r="1.5" fill={color} />
      <circle cx="12" cy="12" r="1.5" fill={color} />
      <circle cx="12" cy="19" r="1.5" fill={color} />
    </svg>
  )
}

export function PageIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 2 L14 2 L18 6 L18 22 L6 22 Z" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.08" strokeLinejoin="round" />
      <path d="M14 2 L14 6 L18 6" stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <line x1="9" y1="10" x2="15" y2="10" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <line x1="9" y1="13" x2="15" y2="13" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <line x1="9" y1="16" x2="13" y2="16" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

export function TextIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="4" y1="6" x2="20" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="6" x2="12" y2="20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="20" x2="16" y2="20" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function RectShapeIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="6" width="18" height="12" rx="1.5" stroke={color} strokeWidth="1.8" fill="none" />
    </svg>
  )
}

export function CircleShapeIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="12" rx="9" ry="7" stroke={color} strokeWidth="1.8" fill="none" />
    </svg>
  )
}

export function LineShapeIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="4" y1="20" x2="20" y2="4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function ShapeToolIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="13" width="9" height="7" rx="1" stroke={color} strokeWidth="1.7" fill="none" />
      <ellipse cx="17" cy="7" rx="4.5" ry="4.5" stroke={color} strokeWidth="1.7" fill="none" />
      <line x1="2" y1="4" x2="10" y2="10" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export function WristGuardIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="8" width="18" height="10" rx="3" stroke={color} strokeWidth="1.7" fill="none" />
      <line x1="7" y1="8" x2="7" y2="18" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <path d="M9 5 Q12 3 15 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function HandScrollIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 3 L9 13 M9 3 Q9 2 10 2 Q11 2 11 3 L11 10 M11 10 Q11 9 12 9 Q13 9 13 10 L13 11 M13 11 Q13 10 14 10 Q15 10 15 11 L15 16 Q15 20 11 21 L9 21 Q6 21 5 18 L4 15 Q4 13 6 13 L9 13" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

export function SearchIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10.5" cy="10.5" r="6.5" stroke={color} strokeWidth="1.8" fill="none" />
      <line x1="15.5" y1="15.5" x2="21" y2="21" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function ChevronLeftIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="15,18 9,12 15,6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ChevronRightIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="9,18 15,12 9,6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
