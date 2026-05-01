import { useState } from 'react'
import { useStorage } from '../hooks/useStorage'

const PAPELITO_COLORS = [
  '#FFF4B8', '#FFD6DC', '#C8E6FF', '#D4F5C8', '#F0D4FF',
  '#FFE4C4', '#C4F4F0', '#FFD6B8', '#E8C4FF', '#D4FFE8',
]

// Posiciones fijas para los papelitos dentro del frasco (en %)
const POSICIONES = [
  { x: 18, y: 72 }, { x: 52, y: 78 }, { x: 72, y: 68 },
  { x: 28, y: 58 }, { x: 62, y: 55 }, { x: 42, y: 62 },
  { x: 15, y: 50 }, { x: 70, y: 48 }, { x: 35, y: 48 },
  { x: 55, y: 42 }, { x: 22, y: 38 }, { x: 65, y: 36 },
  { x: 40, y: 34 }, { x: 18, y: 28 }, { x: 62, y: 26 },
  { x: 32, y: 22 }, { x: 52, y: 18 }, { x: 45, y: 12 },
]

function FrascoSVG({ count, onClickPapelito, colors }) {
  const papelitos = Array.from({ length: Math.min(count, POSICIONES.length) }, (_, i) => ({
    ...POSICIONES[i],
    color: colors[i] || PAPELITO_COLORS[i % PAPELITO_COLORS.length],
    rot: ((i * 47) % 40) - 20,
  }))

  return (
    <svg
      viewBox="0 0 200 280"
      className="w-full"
      style={{ maxWidth: 280, filter: 'drop-shadow(0 8px 24px rgba(61,43,31,0.18))' }}
    >
      <defs>
        {/* Clip path del cuerpo del frasco */}
        <clipPath id="frasco-clip">
          <path d="M 62 78 Q 48 88 42 115 L 28 218 Q 26 248 100 248 Q 174 248 172 218 L 158 115 Q 152 88 138 78 Z" />
        </clipPath>
        {/* Gradiente vidrio */}
        <linearGradient id="vidrio-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="rgba(255,253,245,0.55)" />
          <stop offset="30%"  stopColor="rgba(255,253,245,0.15)" />
          <stop offset="70%"  stopColor="rgba(255,253,245,0.10)" />
          <stop offset="100%" stopColor="rgba(255,253,245,0.40)" />
        </linearGradient>
        {/* Gradiente tapa */}
        <linearGradient id="tapa-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#A08060" />
          <stop offset="100%" stopColor="#7A5A38" />
        </linearGradient>
      </defs>

      {/* ── Papelitos dentro del frasco (clipeados) ── */}
      <g clipPath="url(#frasco-clip)">
        {papelitos.map((p, i) => {
          const cx = 42 + (p.x / 100) * 116
          const cy = 78 + (p.y / 100) * 170
          return (
            <g
              key={i}
              transform={`rotate(${p.rot}, ${cx}, ${cy})`}
              style={{ cursor: 'pointer' }}
              onClick={() => onClickPapelito(i)}
            >
              <rect
                x={cx - 14} y={cy - 9}
                width={28} height={18}
                rx={3}
                fill={p.color}
                opacity={0.9}
              />
              {/* Líneas de texto decorativas */}
              <line x1={cx - 9} y1={cy - 2} x2={cx + 9} y2={cy - 2} stroke="#00000018" strokeWidth={1.2} />
              <line x1={cx - 7} y1={cy + 3} x2={cx + 7} y2={cy + 3} stroke="#00000018" strokeWidth={1.2} />
            </g>
          )
        })}
      </g>

      {/* ── Cuerpo del frasco (vidrio) ── */}
      <path
        d="M 62 78 Q 48 88 42 115 L 28 218 Q 26 248 100 248 Q 174 248 172 218 L 158 115 Q 152 88 138 78 Z"
        fill="url(#vidrio-grad)"
        stroke="#C4A882"
        strokeWidth={3}
      />

      {/* Reflejo lateral izquierdo */}
      <path
        d="M 68 88 Q 55 105 50 130 Q 53 132 57 130 Q 60 105 74 90 Z"
        fill="rgba(255,255,255,0.38)"
      />

      {/* ── Etiqueta ── */}
      <rect x={58} y={142} width={84} height={56} rx={5}
        fill="rgba(242,232,217,0.92)" stroke="#C4A882" strokeWidth={1.5} />
      <text x={100} y={164} textAnchor="middle" fill="#8B7355"
        fontSize={9} fontFamily="Caveat, cursive" fontWeight={700}>
        recuerdos
      </text>
      <text x={100} y={178} textAnchor="middle" fill="#8B7355"
        fontSize={8} fontFamily="Caveat, cursive">
        del viaje ♥
      </text>
      <text x={100} y={192} textAnchor="middle" fill="#C4A882"
        fontSize={7} fontFamily="Caveat, cursive">
        MdP · 2025
      </text>

      {/* ── Cuello del frasco ── */}
      <path
        d="M 62 78 Q 100 70 138 78 L 136 66 Q 100 58 64 66 Z"
        fill="rgba(255,253,245,0.45)"
        stroke="#C4A882"
        strokeWidth={2.5}
      />

      {/* ── Aro/borde de la tapa ── */}
      <rect x={52} y={55} width={96} height={14} rx={5}
        fill="#9B8060" opacity={0.95} />

      {/* ── Tapa ── */}
      <rect x={58} y={32} width={84} height={26} rx={8}
        fill="url(#tapa-grad)" />

      {/* Textura tapa */}
      {[0,1,2,3,4,5,6].map(i => (
        <line key={i}
          x1={62 + i * 12} y1={34} x2={62 + i * 12} y2={56}
          stroke="rgba(255,255,255,0.1)" strokeWidth={1}
        />
      ))}

      {/* Perilla de la tapa */}
      <ellipse cx={100} cy={31} rx={12} ry={6} fill="#8B6A40" />
      <ellipse cx={100} cy={29} rx={9}  ry={4} fill="#A07848" />
    </svg>
  )
}

export default function Recuerdos() {
  const [recuerdos, setRecuerdos] = useStorage('recuerdos', [])
  const [showForm, setShowForm]   = useState(false)
  const [showLista, setShowLista] = useState(false)
  const [seleccionado, setSeleccionado] = useState(null)
  const [texto, setTexto]   = useState('')
  const [autor, setAutor]   = useState('Indi')
  const [animando, setAnimando] = useState(false)

  const colors = recuerdos.map((_, i) => PAPELITO_COLORS[i % PAPELITO_COLORS.length])

  function guardar() {
    if (!texto.trim()) return
    setAnimando(true)
    setTimeout(() => {
      const nuevo = {
        id: Date.now(),
        texto,
        autor,
        fecha: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }),
        color: PAPELITO_COLORS[recuerdos.length % PAPELITO_COLORS.length],
        rot: ((recuerdos.length * 37) % 20) - 10,
      }
      setRecuerdos(prev => [nuevo, ...prev])
      setTexto('')
      setShowForm(false)
      setAnimando(false)
    }, 700)
  }

  function clickPapelito(idx) {
    // Los papelitos dentro del SVG tienen índice directo de recuerdos
    if (recuerdos[idx]) {
      setSeleccionado(recuerdos[idx])
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 py-6 px-4">

      {/* Título */}
      <div className="text-center">
        <p className="font-hand text-base" style={{ color: '#9B8B7A', fontSize: 15 }}>
          {recuerdos.length === 0
            ? 'El frasco está esperando sus primeros recuerdos'
            : `${recuerdos.length} recuerdo${recuerdos.length !== 1 ? 's' : ''} guardado${recuerdos.length !== 1 ? 's' : ''} ♥`}
        </p>
      </div>

      {/* Frasco */}
      <div
        className="w-full flex justify-center cursor-pointer transition-transform active:scale-95"
        style={{ maxWidth: 280 }}
        onClick={() => recuerdos.length > 0 && setShowLista(true)}
        title={recuerdos.length > 0 ? 'Tocá para ver los recuerdos' : ''}
      >
        <FrascoSVG
          count={recuerdos.length}
          colors={colors}
          onClickPapelito={clickPapelito}
        />
      </div>

      {recuerdos.length > 0 && (
        <p className="font-hand text-sm" style={{ color: '#D4A0A0', marginTop: -8 }}>
          ↑ Tocá el frasco para leer los recuerdos
        </p>
      )}

      {/* Botón agregar */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-5 rounded-2xl font-hand text-lg font-bold transition-all active:scale-95"
          style={{
            fontSize: 18,
            background: '#FFFDF5',
            color: '#C4785A',
            border: '2px dashed #D4A0A0',
            boxShadow: '0 2px 8px rgba(196,120,90,0.08)',
          }}
        >
          + Guardar un recuerdo
        </button>
      ) : (
        <div
          className="w-full rounded-3xl p-5 flex flex-col gap-4"
          style={{ background: '#FFFDF5', border: '1.5px solid #D4C4B0', boxShadow: '0 2px 12px rgba(61,43,31,0.08)' }}
        >
          <div
            className="w-full rounded-2xl p-4"
            style={{ background: recuerdos.length < PAPELITO_COLORS.length ? PAPELITO_COLORS[recuerdos.length % PAPELITO_COLORS.length] : '#FFF4B8' }}
          >
            <textarea
              className="w-full resize-none outline-none font-hand text-lg bg-transparent"
              style={{ fontFamily: 'Caveat, cursive', fontSize: 20, color: '#3D2B1F', minHeight: 80 }}
              placeholder="Escribí un momento que quieras recordar siempre..."
              value={texto}
              onChange={e => setTexto(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="font-hand text-base" style={{ color: '#8B7355' }}>de:</span>
            {['Indi', 'Mati'].map(a => (
              <button
                key={a}
                onClick={() => setAutor(a)}
                className="px-5 py-3 rounded-xl font-hand text-base transition-all"
                style={{
                  fontSize: 16,
                  background: autor === a ? '#C4785A' : '#F2E8D9',
                  color:      autor === a ? 'white'   : '#8B7355',
                  border:     '1.5px solid #D4C4B0',
                }}
              >
                {a}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setShowForm(false); setTexto('') }}
              className="flex-1 py-4 rounded-2xl font-hand text-base"
              style={{ fontSize: 16, background: '#F2E8D9', color: '#9B8B7A', border: '1.5px solid #D4C4B0' }}
            >
              Cancelar
            </button>
            <button
              onClick={guardar}
              disabled={animando || !texto.trim()}
              className="flex-1 py-4 rounded-2xl font-hand text-base font-bold text-white transition-all active:scale-95 disabled:opacity-50"
              style={{ fontSize: 16, background: '#C4785A' }}
            >
              {animando ? '✨ Guardando...' : 'Guardar ♥'}
            </button>
          </div>
        </div>
      )}

      {/* Modal: lista de recuerdos */}
      {showLista && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          style={{ background: 'rgba(61,43,31,0.55)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowLista(false) }}
        >
          <div
            className="w-full rounded-t-3xl flex flex-col"
            style={{ background: '#FFFDF5', maxHeight: '85dvh' }}
          >
            <div className="sticky top-0 px-5 pt-5 pb-4 flex items-center justify-between" style={{ borderBottom: '1.5px solid #F2E8D9' }}>
              <div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#3D2B1F', fontStyle: 'italic', fontSize: 20 }}>
                  Nuestros recuerdos
                </h3>
                <p className="font-hand text-sm mt-0.5" style={{ color: '#9B8B7A', fontSize: 13 }}>
                  {recuerdos.length} papelito{recuerdos.length !== 1 ? 's' : ''} en el frasco
                </p>
              </div>
              <button onClick={() => setShowLista(false)} style={{ color: '#9B8B7A', fontSize: 22 }}>✕</button>
            </div>

            <div className="overflow-y-auto p-5 flex flex-col gap-3">
              {recuerdos.map((r, i) => (
                <div
                  key={r.id}
                  className="rounded-2xl p-5 relative cursor-pointer transition-all active:scale-98"
                  style={{
                    background: r.color || PAPELITO_COLORS[i % PAPELITO_COLORS.length],
                    transform: `rotate(${r.rot || 0}deg)`,
                    boxShadow: '1px 3px 8px rgba(61,43,31,0.12)',
                  }}
                  onClick={() => setSeleccionado(r)}
                >
                  <p
                    className="font-hand"
                    style={{ fontFamily: 'Caveat, cursive', fontSize: 20, color: '#3D2B1F', lineHeight: 1.3 }}
                  >
                    {r.texto}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-hand text-sm" style={{ color: '#8B7355', fontSize: 14 }}>— {r.autor}</span>
                    <span className="font-hand text-xs" style={{ color: '#9B8B7A', fontSize: 12 }}>{r.fecha}</span>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); setRecuerdos(prev => prev.filter(x => x.id !== r.id)) }}
                    className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                    style={{ background: 'rgba(61,43,31,0.1)', color: '#8B7355' }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: recuerdo individual */}
      {seleccionado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(61,43,31,0.65)' }}
          onClick={() => setSeleccionado(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-7 relative"
            style={{
              background: seleccionado.color || '#FFF4B8',
              transform: `rotate(${seleccionado.rot || 0}deg)`,
              boxShadow: '0 8px 40px rgba(61,43,31,0.3)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <p
              className="font-hand"
              style={{ fontFamily: 'Caveat, cursive', fontSize: 24, color: '#3D2B1F', lineHeight: 1.4 }}
            >
              {seleccionado.texto}
            </p>
            <div className="flex items-center justify-between mt-5 pt-4" style={{ borderTop: '1px solid rgba(61,43,31,0.12)' }}>
              <span className="font-hand text-base" style={{ color: '#8B7355', fontSize: 17 }}>
                — {seleccionado.autor}
              </span>
              <span className="font-hand text-sm" style={{ color: '#9B8B7A', fontSize: 13 }}>
                {seleccionado.fecha}
              </span>
            </div>
            <button
              onClick={() => setSeleccionado(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(61,43,31,0.1)', color: '#8B7355' }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
