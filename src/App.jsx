import { useState } from 'react'
import BottomNav from './components/BottomNav'
import Gastos from './sections/Gastos'
import Fotos from './sections/Fotos'
import Mapa from './sections/Mapa'
import Recuerdos from './sections/Recuerdos'

const TITLES = {
  gastos:    'Gastos del viaje',
  fotos:     'Nuestras fotos',
  mapa:      'Mar del Plata',
  recuerdos: 'Frasco de recuerdos',
}

export default function App() {
  const [seccion, setSeccion] = useState('gastos')
  const sinHeader = seccion === 'mapa'

  function renderSeccion() {
    switch (seccion) {
      case 'gastos':    return <Gastos />
      case 'fotos':     return <Fotos />
      case 'mapa':      return <Mapa />
      case 'recuerdos': return <Recuerdos />
      default:          return null
    }
  }

  return (
    <div
      className="flex flex-col min-h-dvh"
      style={{ background: '#FAF6EF' }}
    >
      {!sinHeader && (
        <header
          className="sticky top-0 z-30 px-5 py-4"
          style={{
            background: '#FFFFFF',
            borderBottom: '1.5px solid #D4C4B0',
            boxShadow: '0 2px 8px rgba(61,43,31,0.06)',
          }}
        >
          <h1
            style={{
              fontFamily: 'Playfair Display, serif',
              fontStyle: 'italic',
              fontSize: 22,
              color: '#3D2B1F',
              fontWeight: 500,
            }}
          >
            {TITLES[seccion]}
          </h1>
          <p style={{ fontSize: 13, color: '#C4785A', marginTop: 2, fontFamily: 'Lato, sans-serif' }}>
            Indi & Mati · MdP 2025
          </p>
        </header>
      )}

      <main
        className="flex-1 overflow-y-auto"
        style={{ paddingBottom: seccion === 'mapa' ? 60 : 80 }}
      >
        {renderSeccion()}
      </main>

      <BottomNav active={seccion} onChange={setSeccion} />
    </div>
  )
}
