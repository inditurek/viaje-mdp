export default function BottomNav({ active, onChange }) {
  const tabs = [
    { id: 'gastos', label: 'Gastos', emoji: '💰' },
    { id: 'fotos', label: 'Fotos', emoji: '📸' },
    { id: 'mapa', label: 'Mapa', emoji: '🗺️' },
    { id: 'desafios', label: 'Desafíos', emoji: '🎯' },
  ]

  return (
    <nav
      style={{ background: 'white', borderTop: '1px solid #FFB6C1' }}
      className="fixed bottom-0 left-0 right-0 flex z-50 safe-area-pb"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-all"
          style={{
            color: active === tab.id ? '#FF6B6B' : '#9CA3AF',
            fontWeight: active === tab.id ? 600 : 400,
          }}
        >
          <span className="text-xl leading-none">{tab.emoji}</span>
          <span className="text-xs">{tab.label}</span>
          {active === tab.id && (
            <span
              className="absolute bottom-0 w-8 h-0.5 rounded-full"
              style={{ background: '#FF6B6B' }}
            />
          )}
        </button>
      ))}
    </nav>
  )
}
