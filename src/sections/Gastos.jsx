import { useState } from 'react'
import { useStorage } from '../hooks/useStorage'

const CATEGORIAS = [
  { id: 'comida',      label: 'Comida',      emoji: '🍽️', color: '#C4785A' },
  { id: 'cafe',        label: 'Café',        emoji: '☕',  color: '#8B7355' },
  { id: 'actividades', label: 'Actividades', emoji: '🎭',  color: '#7A9E7E' },
  { id: 'transporte',  label: 'Transporte',  emoji: '🚌',  color: '#9B8B7A' },
  { id: 'otro',        label: 'Otro',        emoji: '✨',  color: '#D4A0A0' },
]

const EMPTY = {
  descripcion: '', monto: '', pagador: 'Indi',
  categoria: 'comida', division: '50/50',
  customIndi: '', customMati: '',
}

const LATO = { fontFamily: 'Lato, sans-serif' }
const PLAYFAIR_I = { fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }

export default function Gastos() {
  const [gastos, setGastos] = useStorage('gastos', [])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [filtro, setFiltro] = useState('todos')

  function agregar() {
    if (!form.descripcion || !form.monto) return
    const monto = parseFloat(form.monto)
    const parteIndi = form.division === '50/50' ? monto / 2 : parseFloat(form.customIndi) || 0
    const parteMati = form.division === '50/50' ? monto / 2 : parseFloat(form.customMati) || 0
    setGastos(prev => [{
      id: Date.now(),
      descripcion: form.descripcion,
      monto, pagador: form.pagador, categoria: form.categoria,
      parteIndi, parteMati,
      fecha: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }),
    }, ...prev])
    setForm(EMPTY)
    setShowForm(false)
  }

  const bal = gastos.reduce((a, g) => {
    if (g.pagador === 'Indi') a.matiDebeAIndi += g.parteMati
    else                      a.indiDebeAMati += g.parteIndi
    return a
  }, { matiDebeAIndi: 0, indiDebeAMati: 0 })
  const dif = bal.matiDebeAIndi - bal.indiDebeAMati
  const balTexto = dif > 0.01 ? `Mati le debe $${dif.toFixed(0)} a Indi`
    : dif < -0.01 ? `Indi le debe $${Math.abs(dif).toFixed(0)} a Mati`
    : '¡Están al día! 🎉'

  const filtrados = filtro === 'todos' ? gastos : gastos.filter(g => g.categoria === filtro)

  return (
    <div className="flex flex-col gap-5 py-5">

      {/* Balance */}
      <div className="mx-4 rounded-2xl p-5" style={{ background: '#C4785A' }}>
        <p style={{ ...LATO, color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>Balance actual</p>
        <p style={{ ...PLAYFAIR_I, color: 'white', fontSize: 24, marginTop: 4 }}>{balTexto}</p>
        <div className="flex justify-between mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          {[
            { label: 'Total', valor: `$${gastos.reduce((s,g)=>s+g.monto,0).toFixed(0)}` },
            { label: 'Indi pagó', valor: `$${gastos.filter(g=>g.pagador==='Indi').reduce((s,g)=>s+g.monto,0).toFixed(0)}` },
            { label: 'Mati pagó', valor: `$${gastos.filter(g=>g.pagador==='Mati').reduce((s,g)=>s+g.monto,0).toFixed(0)}` },
          ].map(({ label, valor }) => (
            <div key={label} className="text-center">
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, ...LATO }}>{label}</p>
              <p style={{ color: 'white', fontSize: 20, fontWeight: 700, ...LATO }}>{valor}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filtros */}
      <div className="px-4 flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {[{ id:'todos', label:'Todos', emoji:'🗂️', color:'#8B7355' }, ...CATEGORIAS].map(c => (
          <button
            key={c.id}
            onClick={() => setFiltro(c.id)}
            className="flex items-center gap-1.5 whitespace-nowrap transition-all"
            style={{
              ...LATO,
              padding: '8px 16px',
              borderRadius: 50,
              fontSize: 14,
              fontWeight: filtro === c.id ? 700 : 400,
              background: filtro === c.id ? c.color : '#FFFFFF',
              color:      filtro === c.id ? 'white' : '#8B7355',
              border:     `1.5px solid ${filtro === c.id ? c.color : '#D4C4B0'}`,
            }}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="flex flex-col gap-3 px-4">
        {filtrados.length === 0 ? (
          <div className="text-center py-16" style={{ color: '#9B8B7A' }}>
            <p style={{ fontSize: 48, marginBottom: 12 }}>💸</p>
            <p style={{ ...PLAYFAIR_I, fontSize: 18, color: '#8B7355' }}>Todavía no hay gastos</p>
          </div>
        ) : filtrados.map(g => {
          const cat = CATEGORIAS.find(c => c.id === g.categoria) || CATEGORIAS[4]
          return (
            <div key={g.id} className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: '#FFFFFF', border: '1.5px solid #D4C4B0', boxShadow: '0 1px 4px rgba(61,43,31,0.05)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: cat.color + '18' }}>
                {cat.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate" style={{ color: '#3D2B1F', fontSize: 15, ...LATO }}>{g.descripcion}</p>
                <p style={{ color: '#9B8B7A', fontSize: 13, ...LATO }}>Pagó {g.pagador} · {g.fecha}</p>
                <div className="flex gap-3 mt-1">
                  <span style={{ color: '#C4785A', fontSize: 13, ...LATO }}>Indi ${g.parteIndi.toFixed(0)}</span>
                  <span style={{ color: '#D4C4B0' }}>·</span>
                  <span style={{ color: '#7A9E7E', fontSize: 13, ...LATO }}>Mati ${g.parteMati.toFixed(0)}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <p style={{ fontWeight: 700, fontSize: 16, color: '#3D2B1F', ...LATO }}>${g.monto.toFixed(0)}</p>
                <button onClick={() => setGastos(p => p.filter(x => x.id !== g.id))}
                  style={{ color: '#D4C4B0', fontSize: 12, padding: '2px 8px', borderRadius: 8, background: '#FAF6EF', ...LATO }}>
                  ✕
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-20 right-5 z-30 flex items-center justify-center text-white text-3xl transition-transform active:scale-95"
        style={{ width: 60, height: 60, borderRadius: 30, background: '#C4785A', boxShadow: '0 4px 20px rgba(196,120,90,0.4)' }}
      >
        +
      </button>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end"
          style={{ background: 'rgba(61,43,31,0.5)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}>
          <div className="w-full rounded-t-3xl p-6 flex flex-col gap-5 overflow-y-auto"
            style={{ background: '#FFFFFF', maxHeight: '92dvh' }}>

            <div className="flex items-center justify-between">
              <h2 style={{ ...PLAYFAIR_I, fontSize: 22, color: '#3D2B1F' }}>Nuevo gasto</h2>
              <button onClick={() => setShowForm(false)} style={{ color: '#9B8B7A', fontSize: 24, lineHeight: 1 }}>✕</button>
            </div>

            <input
              style={{ ...LATO, border: '1.5px solid #D4C4B0', background: '#FAF6EF', color: '#3D2B1F', fontSize: 16, borderRadius: 16, padding: '14px 20px', width: '100%', outline: 'none' }}
              placeholder="Descripción (ej: Almuerzo en el puerto)"
              value={form.descripcion}
              onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
            />

            {/* Monto */}
            <input
              type="number"
              style={{ ...LATO, border: '1.5px solid #D4C4B0', background: '#FAF6EF', color: '#3D2B1F', fontSize: 16, borderRadius: 16, padding: '14px 20px', width: '100%', outline: 'none' }}
              placeholder="Monto $"
              value={form.monto}
              onChange={e => setForm(f => ({ ...f, monto: e.target.value }))}
            />

            {/* Pagador */}
            <div>
              <p style={{ ...LATO, color: '#8B7355', fontSize: 14, marginBottom: 10 }}>¿Quién pagó?</p>
              <div className="flex gap-3">
                {['Indi', 'Mati'].map(p => (
                  <button key={p} onClick={() => setForm(f => ({ ...f, pagador: p }))}
                    className="flex-1 transition-all active:scale-95"
                    style={{
                      ...LATO, padding: '14px', borderRadius: 16, fontSize: 16, fontWeight: 700,
                      background: form.pagador === p ? '#C4785A' : '#FAF6EF',
                      color:      form.pagador === p ? 'white'   : '#8B7355',
                      border:     `1.5px solid ${form.pagador === p ? '#C4785A' : '#D4C4B0'}`,
                    }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Categorías */}
            <div>
              <p style={{ ...LATO, color: '#8B7355', fontSize: 14, marginBottom: 10 }}>Categoría</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIAS.map(c => (
                  <button key={c.id} onClick={() => setForm(f => ({ ...f, categoria: c.id }))}
                    className="flex items-center gap-2 transition-all"
                    style={{
                      ...LATO, padding: '10px 16px', borderRadius: 50, fontSize: 14,
                      background: form.categoria === c.id ? c.color : '#FAF6EF',
                      color:      form.categoria === c.id ? 'white' : '#8B7355',
                      border:     `1.5px solid ${form.categoria === c.id ? c.color : '#D4C4B0'}`,
                    }}>
                    <span style={{ fontSize: 18 }}>{c.emoji}</span> {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* División */}
            <div>
              <p style={{ ...LATO, color: '#8B7355', fontSize: 14, marginBottom: 10 }}>División</p>
              <div className="flex gap-3">
                {['50/50', 'custom'].map(d => (
                  <button key={d} onClick={() => setForm(f => ({ ...f, division: d }))}
                    className="flex-1 transition-all"
                    style={{
                      ...LATO, padding: '14px', borderRadius: 16, fontSize: 15,
                      background: form.division === d ? '#8B7355' : '#FAF6EF',
                      color:      form.division === d ? 'white'   : '#8B7355',
                      border:     `1.5px solid ${form.division === d ? '#8B7355' : '#D4C4B0'}`,
                    }}>
                    {d === '50/50' ? '50 / 50' : 'Personalizado'}
                  </button>
                ))}
              </div>
              {form.division === 'custom' && (
                <div className="flex gap-3 mt-3">
                  {[['customIndi', 'Parte Indi $'], ['customMati', 'Parte Mati $']].map(([key, ph]) => (
                    <input key={key} type="number"
                      style={{ ...LATO, flex: 1, border: '1.5px solid #D4C4B0', background: '#FAF6EF', color: '#3D2B1F', fontSize: 15, borderRadius: 16, padding: '12px 16px', outline: 'none' }}
                      placeholder={ph}
                      value={form[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    />
                  ))}
                </div>
              )}
            </div>

            <button onClick={agregar}
              className="w-full transition-all active:scale-95"
              style={{ ...LATO, padding: '18px', borderRadius: 16, background: '#C4785A', color: 'white', fontSize: 17, fontWeight: 700, boxShadow: '0 4px 12px rgba(196,120,90,0.3)' }}>
              Agregar gasto 💸
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
