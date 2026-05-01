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

// Altura del header fijo (px)
const HEADER_H = 72

export { HEADER_H }

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
    <div className="flex flex-col" style={{ minHeight: '100dvh', background: '#FAF6EF' }}>

      {/* Header (todas menos mapa) */}
      {!sinHeader && (
        <header className="flex-shrink-0" style={{
          background: '#FFFFFF',
          borderBottom: '1.5px solid #D4C4B0',
          boxShadow: '0 2px 8px rgba(61,43,31,0.06)',
          padding: '14px 20px',
          // Safe area top (notch)
          paddingTop: 'max(14px, calc(env(safe-area-inset-top, 0px) + 8px))',
        }}>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontStyle: 'italic',
            fontSize: 22,
            color: '#3D2B1F',
            fontWeight: 500,
            lineHeight: 1.2,
          }}>
            {TITLES[seccion]}
          </h1>
          <p style={{ fontSize: 13, color: '#C4785A', marginTop: 2, fontFamily: 'Lato, sans-serif' }}>
            Indi & Mati · MDQ 2026
          </p>
        </header>
      )}

      {/* Contenido principal — scrolleable, padding-bottom = nav + safe area */}
      <main
        className="flex-1 overflow-y-auto"
        style={{
          // Nav 60px + safe area bottom del iPhone
          paddingBottom: 'calc(60px + env(safe-area-inset-bottom, 0px) + 12px)',
        }}
      >
        {renderSeccion()}
      </main>

      <BottomNav active={seccion} onChange={setSeccion} />
    </div>
  )
}
