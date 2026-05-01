import { useState } from 'react'
import BottomNav from './components/BottomNav'
import Drawer from './components/Drawer'
import Gastos from './sections/Gastos'
import Fotos from './sections/Fotos'
import Mapa from './sections/Mapa'
import Desafios from './sections/Desafios'
import Playlist from './sections/Playlist'
import Momentos from './sections/Momentos'
import Juegos from './sections/Juegos'
import Dado from './sections/Dado'

const BOTTOM_TABS = ['gastos', 'fotos', 'mapa', 'desafios']
const DRAWER_TABS = ['playlist', 'momentos', 'juegos', 'dado']

const SECTION_TITLES = {
  gastos: '💰 Gastos',
  fotos: '📸 Fototeca',
  mapa: '🗺️ Mapa',
  desafios: '🎯 Desafíos',
  playlist: '🎵 Playlist',
  momentos: '💭 Momentos',
  juegos: '🎲 Juegos',
  dado: '🎲 Dado',
}

export default function App() {
  const [seccion, setSeccion] = useState('gastos')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const esDrawerTab = DRAWER_TABS.includes(seccion)
  const esBottomTab = BOTTOM_TABS.includes(seccion)

  function renderSeccion() {
    switch (seccion) {
      case 'gastos': return <Gastos />
      case 'fotos': return <Fotos />
      case 'mapa': return <Mapa />
      case 'desafios': return <Desafios />
      case 'playlist': return <Playlist />
      case 'momentos': return <Momentos />
      case 'juegos': return <Juegos />
      case 'dado': return <Dado />
      default: return null
    }
  }

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: '#F7F3E9' }}>
      {/* Top bar solo para secciones del drawer */}
      {esDrawerTab && (
        <header
          className="sticky top-0 z-30 flex items-center px-4 py-3 bg-white border-b"
          style={{ borderColor: '#FFB6C1' }}
        >
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center mr-3"
            style={{ background: '#FFF0F5' }}
          >
            ☰
          </button>
          <h1 className="font-bold text-base" style={{ fontFamily: 'Comfortaa', color: '#FF6B6B' }}>
            {SECTION_TITLES[seccion]}
          </h1>
        </header>
      )}

      {/* Hamburger button para abrir drawer desde bottom tabs */}
      {esBottomTab && seccion !== 'mapa' && (
        <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white border-b" style={{ borderColor: '#FFB6C1' }}>
          <h1 className="font-bold text-base" style={{ fontFamily: 'Comfortaa', color: '#FF6B6B' }}>
            {SECTION_TITLES[seccion]}
          </h1>
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: '#FFF0F5', color: '#FF6B6B' }}
          >
            ☰
          </button>
        </div>
      )}

      {/* Contenido */}
      <main
        className="flex-1 overflow-y-auto"
        style={{
          paddingBottom: esBottomTab ? 72 : 16,
          // El mapa tiene su propio manejo de altura
        }}
      >
        {renderSeccion()}
      </main>

      {/* Bottom nav solo en tabs principales */}
      {esBottomTab && (
        <BottomNav active={seccion} onChange={setSeccion} />
      )}

      {/* Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        active={seccion}
        onChange={setSeccion}
      />
    </div>
  )
}
