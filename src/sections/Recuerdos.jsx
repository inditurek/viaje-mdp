import { useState } from 'react'
import { useStorage } from '../hooks/useStorage'

const PAPELITO_COLORS = [
  '#FFF4B8', '#FFD6DC', '#C8E6FF', '#D4F5C8', '#F0D4FF',
  '#FFE4C4', '#C4F4F0', '#FFD6B8', '#E8C4FF', '#D4FFE8',
]

const POSICIONES = [
  { x: 20, y: 75 }, { x: 55, y: 80 }, { x: 74, y: 70 },
  { x: 30, y: 62 }, { x: 63, y: 57 }, { x: 44, y: 65 },
  { x: 16, y: 52 }, { x: 72, y: 50 }, { x: 38, y: 50 },
  { x: 57, y: 44 }, { x: 24, y: 40 }, { x: 67, y: 38 },
  { x: 42, y: 35 }, { x: 19, y: 30 }, { x: 64, y: 28 },
  { x: 33, y: 24 }, { x: 53, y: 20 }, { x: 46, y: 14 },
]

const LATO     = { fontFamily: 'Lato, sans-serif' }
const PLAYFAIR = { fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }

function FrascoSVG({ count, onClickPapelito, recuerdos }) {
  const papelitos = Array.from({ length: Math.min(count, POSICIONES.length) }, (_, i) => ({
    ...POSICIONES[i],
    color: recuerdos[i]?.color || PAPELITO_COLORS[i % PAPELITO_COLORS.length],
    rot: ((i * 47) % 40) - 20,
  }))

  return (
    <svg viewBox="0 0 200 280" style={{ width: '100%', maxWidth: 260, filter: 'drop-shadow(0 8px 28px rgba(61,43,31,0.16))' }}>
      <defs>
        <clipPath id="frasco-clip">
          <path d="M 62 78 Q 48 88 42 115 L 28 218 Q 26 248 100 248 Q 174 248 172 218 L 158 115 Q 152 88 138 78 Z" />
        </clipPath>
        <linearGradient id="vidrio" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="rgba(255,253,245,0.5)" />
          <stop offset="30%"  stopColor="rgba(255,253,245,0.12)" />
          <stop offset="70%"  stopColor="rgba(255,253,245,0.08)" />
          <stop offset="100%" stopColor="rgba(255,253,245,0.38)" />
        </linearGradient>
        <linearGradient id="tapa" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#A08060" />
          <stop offset="100%" stopColor="#7A5A38" />
        </linearGradient>
      </defs>

      {/* Papelitos dentro */}
      <g clipPath="url(#frasco-clip)">
        {papelitos.map((p, i) => {
          const cx = 42 + (p.x / 100) * 116
          const cy = 78 + (p.y / 100) * 170
          return (
            <g key={i} transform={`rotate(${p.rot},${cx},${cy})`}
              style={{ cursor: 'pointer' }} onClick={() => onClickPapelito(i)}>
              <rect x={cx - 14} y={cy - 9} width={28} height={18} rx={3} fill={p.color} opacity={0.92} />
              <line x1={cx - 9} y1={cy - 2} x2={cx + 9} y2={cy - 2} stroke="#00000015" strokeWidth={1.2} />
              <line x1={cx - 7} y1={cy + 3} x2={cx + 7} y2={cy + 3} stroke="#00000015" strokeWidth={1.2} />
            </g>
          )
        })}
      </g>

      {/* Vidrio */}
      <path d="M 62 78 Q 48 88 42 115 L 28 218 Q 26 248 100 248 Q 174 248 172 218 L 158 115 Q 152 88 138 78 Z"
        fill="url(#vidrio)" stroke="#C4A882" strokeWidth={3} />
      {/* Reflejo */}
      <path d="M 68 88 Q 55 105 50 130 Q 53 132 57 130 Q 60 105 74 90 Z" fill="rgba(255,255,255,0.35)" />

      {/* Etiqueta */}
      <rect x={58} y={142} width={84} height={56} rx={5} fill="rgba(250,246,239,0.92)" stroke="#C4A882" strokeWidth={1.5} />
      <text x={100} y={165} textAnchor="middle" fill="#8B7355" fontSize={9} fontFamily="Lato, sans-serif" fontWeight={700}>recuerdos</text>
      <text x={100} y={179} textAnchor="middle" fill="#8B7355" fontSize={8} fontFamily="Lato, sans-serif">del viaje ♥</text>
      <text x={100} y={192} textAnchor="middle" fill="#C4A882" fontSize={7} fontFamily="Lato, sans-serif">MdP · 2025</text>

      {/* Cuello */}
      <path d="M 62 78 Q 100 70 138 78 L 136 66 Q 100 58 64 66 Z"
        fill="rgba(255,253,245,0.4)" stroke="#C4A882" strokeWidth={2.5} />

      {/* Aro tapa */}
      <rect x={52} y={55} width={96} height={14} rx={5} fill="#9B8060" opacity={0.95} />

      {/* Tapa */}
      <rect x={58} y={32} width={84} height={26} rx={8} fill="url(#tapa)" />
      {[0,1,2,3,4,5,6].map(i => (
        <line key={i} x1={62 + i * 12} y1={34} x2={62 + i * 12} y2={56} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
      ))}

      {/* Perilla */}
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
  const [texto, setTexto] = useState('')
  const [autor, setAutor] = useState('Indi')
  const [animando, setAnimando] = useState(false)

  function guardar() {
    if (!texto.trim()) return
    setAnimando(true)
    setTimeout(() => {
      setRecuerdos(prev => [{
        id: Date.now(), texto, autor,
        fecha: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }),
        color: PAPELITO_COLORS[prev.length % PAPELITO_COLORS.length],
        rot: ((prev.length * 37) % 20) - 10,
      }, ...prev])
      setTexto(''); setShowForm(false); setAnimando(false)
    }, 600)
  }

  return (
    <div className="flex flex-col items-center gap-6 py-6 px-4">

      <p style={{ ...LATO, color: '#9B8B7A', fontSize: 14, textAlign: 'center' }}>
        {recuerdos.length === 0
          ? 'El frasco está esperando sus primeros recuerdos'
          : `${recuerdos.length} recuerdo${recuerdos.length !== 1 ? 's' : ''} guardado${recuerdos.length !== 1 ? 's' : ''} ♥`}
      </p>

      {/* Frasco */}
      <div className="w-full flex justify-center cursor-pointer transition-transform active:scale-95"
        style={{ maxWidth: 260 }}
        onClick={() => recuerdos.length > 0 && setShowLista(true)}>
        <FrascoSVG count={recuerdos.length} recuerdos={recuerdos}
          onClickPapelito={i => recuerdos[i] && setSeleccionado(recuerdos[i])} />
      </div>

      {recuerdos.length > 0 && (
        <p style={{ ...LATO, color: '#D4A0A0', fontSize: 13, marginTop: -12 }}>
          ↑ Tocá el frasco para leer los recuerdos
        </p>
      )}

      {/* Botón agregar */}
      {!showForm ? (
        <button onClick={() => setShowForm(true)}
          className="w-full transition-all active:scale-95"
          style={{ ...LATO, padding: '18px', borderRadius: 16, fontSize: 16, fontWeight: 700, background: '#FFFFFF', color: '#C4785A', border: '2px dashed #D4A0A0' }}>
          + Guardar un recuerdo
        </button>
      ) : (
        <div className="w-full rounded-3xl p-5 flex flex-col gap-4"
          style={{ background: '#FFFFFF', border: '1.5px solid #D4C4B0', boxShadow: '0 2px 12px rgba(61,43,31,0.07)' }}>
          <div style={{
            borderRadius: 16, padding: 16,
            background: PAPELITO_COLORS[recuerdos.length % PAPELITO_COLORS.length],
          }}>
            <textarea
              className="w-full resize-none outline-none bg-transparent"
              style={{ ...LATO, fontSize: 16, color: '#3D2B1F', minHeight: 90 }}
              placeholder="Escribí un momento que quieran recordar siempre..."
              value={texto}
              onChange={e => setTexto(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex items-center gap-3">
            <span style={{ ...LATO, color: '#8B7355', fontSize: 14 }}>De:</span>
            {['Indi', 'Mati'].map(a => (
              <button key={a} onClick={() => setAutor(a)}
                style={{
                  ...LATO, padding: '10px 20px', borderRadius: 50, fontSize: 15,
                  background: autor === a ? '#C4785A' : '#FAF6EF',
                  color:      autor === a ? 'white'   : '#8B7355',
                  border:     '1.5px solid #D4C4B0',
                }}>
                {a}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => { setShowForm(false); setTexto('') }}
              style={{ ...LATO, flex: 1, padding: '14px', borderRadius: 16, fontSize: 15, background: '#FAF6EF', color: '#9B8B7A', border: '1.5px solid #D4C4B0' }}>
              Cancelar
            </button>
            <button onClick={guardar} disabled={animando || !texto.trim()}
              style={{ ...LATO, flex: 1, padding: '14px', borderRadius: 16, fontSize: 15, fontWeight: 700, background: '#C4785A', color: 'white', opacity: (!texto.trim() || animando) ? 0.5 : 1 }}>
              {animando ? 'Guardando...' : 'Guardar ♥'}
            </button>
          </div>
        </div>
      )}

      {/* Modal lista */}
      {showLista && (
        <div className="fixed inset-0 z-50 flex items-end"
          style={{ background: 'rgba(61,43,31,0.55)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowLista(false) }}>
          <div className="w-full rounded-t-3xl flex flex-col" style={{ background: '#FFFFFF', maxHeight: '85dvh' }}>
            <div className="sticky top-0 px-5 pt-5 pb-4 flex items-center justify-between"
              style={{ borderBottom: '1.5px solid #FAF6EF', background: '#FFFFFF' }}>
              <div>
                <h3 style={{ ...PLAYFAIR, fontSize: 20, color: '#3D2B1F' }}>Nuestros recuerdos</h3>
                <p style={{ ...LATO, color: '#9B8B7A', fontSize: 13, marginTop: 2 }}>
                  {recuerdos.length} papelito{recuerdos.length !== 1 ? 's' : ''} en el frasco
                </p>
              </div>
              <button onClick={() => setShowLista(false)} style={{ color: '#9B8B7A', fontSize: 24, lineHeight: 1 }}>✕</button>
            </div>
            <div className="overflow-y-auto p-5 flex flex-col gap-3">
              {recuerdos.map((r, i) => (
                <div key={r.id} className="rounded-2xl p-5 relative cursor-pointer"
                  style={{ background: r.color || PAPELITO_COLORS[i % PAPELITO_COLORS.length], transform: `rotate(${r.rot || 0}deg)`, boxShadow: '1px 3px 8px rgba(61,43,31,0.1)' }}
                  onClick={() => setSeleccionado(r)}>
                  <p style={{ ...LATO, fontSize: 16, color: '#3D2B1F', lineHeight: 1.5 }}>{r.texto}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span style={{ ...LATO, fontSize: 13, color: '#8B7355', fontWeight: 700 }}>— {r.autor}</span>
                    <span style={{ ...LATO, fontSize: 12, color: '#9B8B7A' }}>{r.fecha}</span>
                  </div>
                  <button onClick={e => { e.stopPropagation(); setRecuerdos(prev => prev.filter(x => x.id !== r.id)) }}
                    className="absolute top-3 right-3 flex items-center justify-center"
                    style={{ width: 24, height: 24, borderRadius: 12, background: 'rgba(61,43,31,0.1)', color: '#8B7355', fontSize: 12 }}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal recuerdo individual */}
      {seleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(61,43,31,0.65)' }}
          onClick={() => setSeleccionado(null)}>
          <div className="w-full max-w-sm rounded-3xl p-7 relative"
            style={{ background: seleccionado.color || '#FFF4B8', transform: `rotate(${seleccionado.rot || 0}deg)`, boxShadow: '0 8px 40px rgba(61,43,31,0.3)' }}
            onClick={e => e.stopPropagation()}>
            <p style={{ ...PLAYFAIR, fontSize: 22, color: '#3D2B1F', lineHeight: 1.5 }}>{seleccionado.texto}</p>
            <div className="flex items-center justify-between mt-5 pt-4" style={{ borderTop: '1px solid rgba(61,43,31,0.1)' }}>
              <span style={{ ...LATO, fontSize: 15, color: '#8B7355', fontWeight: 700 }}>— {seleccionado.autor}</span>
              <span style={{ ...LATO, fontSize: 13, color: '#9B8B7A' }}>{seleccionado.fecha}</span>
            </div>
            <button onClick={() => setSeleccionado(null)}
              className="absolute top-4 right-4 flex items-center justify-center"
              style={{ width: 32, height: 32, borderRadius: 16, background: 'rgba(61,43,31,0.1)', color: '#8B7355' }}>
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
