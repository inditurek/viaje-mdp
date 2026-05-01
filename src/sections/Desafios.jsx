import { useState } from 'react'
import { useStorage } from '../hooks/useStorage'

const DESAFIOS_INICIALES = [
  { id: 1, texto: 'Probar un alfajor de cada marca diferente 🍫', completado: false },
  { id: 2, texto: 'Foto haciendo una torre de piedras en la playa 🪨', completado: false },
  { id: 3, texto: 'Bailar juntos en la rambla 💃🕺', completado: false },
  { id: 4, texto: 'Ver el amanecer juntos 🌅', completado: false },
  { id: 5, texto: 'Comprar un recuerdo kitsch del lugar 🧸', completado: false },
  { id: 6, texto: 'Hacer un castillo de arena 🏰', completado: false },
  { id: 7, texto: 'Comer en un restaurante sin ver la carta (pedir lo que recomienda el mozo) 🍽️', completado: false },
  { id: 8, texto: 'Tomar mate mirando el mar ☕', completado: false },
  { id: 9, texto: 'Escribir algo en la arena antes de que lo tape el agua 🌊', completado: false },
  { id: 10, texto: 'Foto con los lobos marinos 🦭', completado: false },
  { id: 11, texto: 'Perderse juntos por calles nuevas sin GPS 🗺️', completado: false },
  { id: 12, texto: 'Probar el chipá del puerto 🫓', completado: false },
  { id: 13, texto: 'Ver una película o serie juntos en el hotel 🎬', completado: false },
  { id: 14, texto: 'Sacar una foto en blanco y negro que quede linda 🖤', completado: false },
  { id: 15, texto: 'Nadar aunque el agua esté fría 🥶', completado: false },
]

export default function Desafios() {
  const [desafios, setDesafios] = useStorage('desafios', DESAFIOS_INICIALES)
  const [nuevoTexto, setNuevoTexto] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [celebrating, setCelebrating] = useState(null)

  const completados = desafios.filter(d => d.completado).length
  const total = desafios.length
  const progreso = total > 0 ? (completados / total) * 100 : 0

  function toggleDesafio(id) {
    const desafio = desafios.find(d => d.id === id)
    if (!desafio.completado) {
      setCelebrating(id)
      setTimeout(() => setCelebrating(null), 1000)
    }
    setDesafios(prev => prev.map(d => d.id === id ? { ...d, completado: !d.completado } : d))
  }

  function agregarDesafio() {
    if (!nuevoTexto.trim()) return
    setDesafios(prev => [...prev, {
      id: Date.now(),
      texto: nuevoTexto,
      completado: false,
      custom: true,
    }])
    setNuevoTexto('')
    setShowInput(false)
  }

  function eliminarDesafio(id) {
    setDesafios(prev => prev.filter(d => d.id !== id))
  }

  const pendientes = desafios.filter(d => !d.completado)
  const hechos = desafios.filter(d => d.completado)

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Header */}
      <div
        className="mx-4 mt-4 rounded-3xl p-5 text-white"
        style={{ background: 'linear-gradient(135deg, #FFB347, #FF9ECD)' }}
      >
        <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'Comfortaa' }}>
          🎯 Desafíos del viaje
        </h2>
        <p className="text-white/80 text-sm mb-3">{completados} de {total} completados</p>
        <div className="w-full h-3 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progreso}%`, background: 'white' }}
          />
        </div>
        {completados === total && total > 0 && (
          <p className="text-white text-center mt-3 font-bold">¡Lo lograron todos! 🎉🎊</p>
        )}
      </div>

      {/* Pendientes */}
      {pendientes.length > 0 && (
        <div className="mx-4">
          <p className="text-sm font-semibold text-gray-500 mb-2 px-1">Por hacer</p>
          <div className="flex flex-col gap-2">
            {pendientes.map(d => (
              <div
                key={d.id}
                className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm transition-all"
                style={{
                  transform: celebrating === d.id ? 'scale(1.03)' : 'scale(1)',
                  background: celebrating === d.id ? '#FFF0F5' : 'white',
                }}
              >
                <button
                  onClick={() => toggleDesafio(d.id)}
                  className="w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                  style={{ borderColor: '#FFB347' }}
                >
                  {celebrating === d.id && <span className="text-sm">✓</span>}
                </button>
                <p className="flex-1 text-sm text-gray-700 leading-snug">{d.texto}</p>
                {d.custom && (
                  <button onClick={() => eliminarDesafio(d.id)} className="text-gray-300 text-xs">✕</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completados */}
      {hechos.length > 0 && (
        <div className="mx-4">
          <p className="text-sm font-semibold text-gray-500 mb-2 px-1">Completados ✅</p>
          <div className="flex flex-col gap-2">
            {hechos.map(d => (
              <div
                key={d.id}
                className="rounded-2xl p-4 flex items-center gap-3"
                style={{ background: '#F0FFF8' }}
              >
                <button
                  onClick={() => toggleDesafio(d.id)}
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm"
                  style={{ background: '#4ECDC4' }}
                >
                  ✓
                </button>
                <p className="flex-1 text-sm text-gray-400 line-through leading-snug">{d.texto}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agregar desafío */}
      <div className="mx-4">
        {showInput ? (
          <div className="flex gap-2">
            <input
              className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-orange-300"
              placeholder="Nuevo desafío..."
              value={nuevoTexto}
              onChange={e => setNuevoTexto(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && agregarDesafio()}
              autoFocus
            />
            <button
              onClick={agregarDesafio}
              className="px-4 py-3 rounded-2xl text-white text-sm font-medium"
              style={{ background: '#FFB347' }}
            >
              +
            </button>
            <button
              onClick={() => setShowInput(false)}
              className="px-3 py-3 rounded-2xl text-gray-400 text-sm border border-gray-200"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="w-full py-3 rounded-2xl text-sm font-medium border-2 border-dashed transition-all"
            style={{ borderColor: '#FFB347', color: '#FFB347' }}
          >
            + Agregar desafío propio
          </button>
        )}
      </div>
    </div>
  )
}
