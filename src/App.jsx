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

  function renderSeccion() {
    switch (seccion) {
      case 'gastos':    return <Gastos />
      case 'fotos':     return <Fotos />
      case 'mapa':      return <Mapa />
      case 'recuerdos': return <Recuerdos />
      default:          return null
    }
  }

  const sinHeader = seccion === 'mapa'

  return (
    <div className="flex flex-col min-h-dvh parchment-bg">
      {!sinHeader && (
        <header
          className="sticky top-0 z-30 px-5 py-4"
          style={{
            background: '#FFFDF5',
            borderBottom: '2px solid #D4C4B0',
            boxShadow: '0 2px 8px rgba(61,43,31,0.06)',
          }}
        >
          <h1
            className="text-xl"
            style={{ fontFamily: 'Playfair Display, serif', color: '#3D2B1F', fontStyle: 'italic' }}
          >
            {TITLES[seccion]}
          </h1>
          <p className="font-hand text-sm mt-0.5" style={{ color: '#C4785A', fontSize: 14 }}>
            Indi & Mati · MdP 2025
          </p>
        </header>
      )}

      <main
        className="flex-1 overflow-y-auto"
        style={{ paddingBottom: seccion === 'mapa' ? 64 : 80 }}
      >
        {renderSeccion()}
      </main>

      <BottomNav active={seccion} onChange={setSeccion} />
    </div>
  )
}
