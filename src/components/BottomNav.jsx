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
        background: '#FFFDF5',
        borderTop: '2px solid #D4C4B0',
        boxShadow: '0 -2px 12px rgba(61,43,31,0.08)',
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 relative transition-all"
          style={{ minHeight: 56 }}
        >
          <span className="text-xl leading-none">{tab.emoji}</span>
          <span
            className="text-xs font-hand"
            style={{
              color: active === tab.id ? '#C4785A' : '#9B8B7A',
              fontWeight: active === tab.id ? 700 : 400,
              fontSize: 13,
            }}
          >
            {tab.label}
          </span>
          {active === tab.id && (
            <span
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full"
              style={{ background: '#C4785A' }}
            />
          )}
        </button>
      ))}
    </nav>
  )
}
