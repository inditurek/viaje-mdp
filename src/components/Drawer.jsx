import { useEffect } from 'react'

const drawerItems = [
  { id: 'playlist', label: 'Playlist del viaje', emoji: '🎵' },
  { id: 'momentos', label: 'Frasco de momentos', emoji: '💭' },
  { id: 'juegos', label: 'Juegos para dos', emoji: '🎲' },
  { id: 'dado', label: 'Dado de decisiones', emoji: '🎲' },
]

export default function Drawer({ open, onClose, active, onChange }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className="fixed top-0 left-0 h-full w-72 z-50 flex flex-col shadow-2xl transition-transform duration-300"
        style={{
          background: 'white',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <div className="p-6 pb-4" style={{ background: '#FF6B6B' }}>
          <h2 className="text-white text-xl font-bold">🌊 Mar del Plata</h2>
          <p className="text-white/80 text-sm mt-1">Viaje juntos ♥</p>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2">
          {drawerItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onChange(item.id); onClose() }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all"
              style={{
                background: active === item.id ? '#FFF0F0' : 'transparent',
                color: active === item.id ? '#FF6B6B' : '#374151',
                fontWeight: active === item.id ? 600 : 400,
              }}
            >
              <span className="text-xl">{item.emoji}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 text-center text-xs text-gray-400">
          Hecho con ♥ para este viaje
        </div>
      </div>
    </>
  )
}
