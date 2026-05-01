export default function BottomNav({ active, onChange }) {
  const tabs = [
    { id: 'gastos',    label: 'Gastos',    emoji: '💰' },
    { id: 'fotos',     label: 'Fotos',     emoji: '📸' },
    { id: 'mapa',      label: 'Mapa',      emoji: '🗺️' },
    { id: 'recuerdos', label: 'Recuerdos', emoji: '🫙' },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex z-50"
      style={{
        background: '#FFFFFF',
        borderTop: '1.5px solid #D4C4B0',
        boxShadow: '0 -2px 12px rgba(61,43,31,0.08)',
        // Safe area iPhone (home indicator)
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 relative"
          style={{ height: 60 }}
        >
          <span style={{ fontSize: 22, lineHeight: 1 }}>{tab.emoji}</span>
          <span style={{
            fontFamily: 'Lato, sans-serif',
            fontSize: 11,
            color: active === tab.id ? '#C4785A' : '#9B8B7A',
            fontWeight: active === tab.id ? 700 : 400,
          }}>
            {tab.label}
          </span>
          {active === tab.id && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 rounded-full"
              style={{ background: '#C4785A', height: 3 }} />
          )}
        </button>
      ))}
    </nav>
  )
}
