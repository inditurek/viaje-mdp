import { useState } from 'react'
import { useStorage } from '../hooks/useStorage'

const CATEGORIAS = [
  { id: 'comida',      label: 'Comida',      emoji: '🍽️', color: '#C4785A' },
  { id: 'cafe',        label: 'Café',        emoji: '☕',  color: '#8B7355' },
  { id: 'actividades', label: 'Actividades', emoji: '🎭',  color: '#7A9E7E' },
  { id: 'transporte',  label: 'Transporte',  emoji: '🚌',  color: '#9B8B7A' },
  { id: 'otro',        label: 'Otro',        emoji: '✨',  color: '#D4A0A0' },
]

const PERSONAS = ['Indi', 'Mati']

const EMPTY_FORM = {
  descripcion: '', monto: '', pagador: 'Indi',
  categoria: 'comida', division: '50/50',
  customIndi: '', customMati: '',
}

function SectionCard({ children, style }) {
  return (
    <div
      className="mx-4 rounded-2xl p-5"
      style={{ background: '#FFFDF5', border: '1.5px solid #D4C4B0', boxShadow: '0 2px 8px rgba(61,43,31,0.07)', ...style }}
    >
      {children}
    </div>
  )
}

export default function Gastos() {
  const [gastos, setGastos] = useStorage('gastos', [])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [filtro, setFiltro] = useState('todos')

  function agregar() {
    if (!form.descripcion || !form.monto) return
    const monto = parseFloat(form.monto)
    let parteIndi, parteM
    if (form.division === '50/50') {
      parteIndi = monto / 2; parteM = monto / 2
    } else {
      parteIndi = parseFloat(form.customIndi) || 0
      parteM    = parseFloat(form.customMati) || 0
    }
    setGastos(prev => [{
      id: Date.now(),
      descripcion: form.descripcion,
      monto,
      pagador: form.pagador,
      categoria: form.categoria,
      parteIndi,
      parteMati: parteM,
      fecha: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }),
    }, ...prev])
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  const balance = gastos.reduce(
    (acc, g) => {
      if (g.pagador === 'Indi') acc.matiDebeAIndi += g.parteMati
      else                      acc.indiDebeAMati += g.parteIndi
      return acc
    },
    { matiDebeAIndi: 0, indiDebeAMati: 0 }
  )
  const dif = balance.matiDebeAIndi - balance.indiDebeAMati
  const balanceTexto = dif > 0.01
    ? `Mati le debe $${dif.toFixed(0)} a Indi`
    : dif < -0.01
      ? `Indi le debe $${Math.abs(dif).toFixed(0)} a Mati`
      : '¡Están al día! 🎉'

  const gastosFiltrados = filtro === 'todos' ? gastos : gastos.filter(g => g.categoria === filtro)
  const totalGastado = gastos.reduce((s, g) => s + g.monto, 0)

  return (
    <div className="flex flex-col gap-5 py-5">

      {/* Balance card */}
      <SectionCard style={{ background: '#C4785A', border: 'none' }}>
        <p className="font-hand text-white/80 text-base">Balance actual</p>
        <p
          className="font-hand text-white mt-1"
          style={{ fontSize: 26, fontWeight: 700 }}
        >
          {balanceTexto}
        </p>
        <div className="flex justify-between mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.25)' }}>
          {[
            { label: 'Total', valor: `$${totalGastado.toFixed(0)}` },
            { label: 'Indi pagó', valor: `$${gastos.filter(g=>g.pagador==='Indi').reduce((s,g)=>s+g.monto,0).toFixed(0)}` },
            { label: 'Mati pagó', valor: `$${gastos.filter(g=>g.pagador==='Mati').reduce((s,g)=>s+g.monto,0).toFixed(0)}` },
          ].map(({ label, valor }) => (
            <div key={label} className="text-center">
              <p className="text-white/70 text-xs">{label}</p>
              <p className="font-hand text-white font-bold text-lg">{valor}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Filtros */}
      <div className="px-4 flex gap-2 overflow-x-auto pb-1">
        {[{ id: 'todos', label: 'Todos', emoji: '🗂️', color: '#8B7355' }, ...CATEGORIAS].map(c => (
          <button
            key={c.id}
            onClick={() => setFiltro(c.id)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm whitespace-nowrap font-hand transition-all"
            style={{
              fontSize: 15,
              background: filtro === c.id ? c.color : '#FFFDF5',
              color:      filtro === c.id ? 'white'  : '#8B7355',
              border:     `1.5px solid ${filtro === c.id ? c.color : '#D4C4B0'}`,
            }}
          >
            <span>{c.emoji}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Lista de gastos */}
      <div className="flex flex-col gap-3 px-4">
        {gastosFiltrados.length === 0 ? (
          <div className="text-center py-16" style={{ color: '#9B8B7A' }}>
            <p className="text-5xl mb-4">💸</p>
            <p className="font-hand text-lg">Todavía no hay gastos</p>
          </div>
        ) : (
          gastosFiltrados.map(g => {
            const cat = CATEGORIAS.find(c => c.id === g.categoria) || CATEGORIAS[4]
            return (
              <div
                key={g.id}
                className="rounded-2xl p-4 flex items-center gap-4"
                style={{ background: '#FFFDF5', border: '1.5px solid #D4C4B0', boxShadow: '0 1px 4px rgba(61,43,31,0.05)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: cat.color + '18' }}
                >
                  {cat.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate" style={{ color: '#3D2B1F', fontSize: 16 }}>{g.descripcion}</p>
                  <p className="text-sm mt-0.5" style={{ color: '#9B8B7A' }}>Pagó {g.pagador} · {g.fecha}</p>
                  <div className="flex gap-3 mt-1.5">
                    <span className="font-hand text-sm" style={{ color: '#C4785A', fontSize: 14 }}>Indi ${g.parteIndi.toFixed(0)}</span>
                    <span style={{ color: '#D4C4B0' }}>·</span>
                    <span className="font-hand text-sm" style={{ color: '#7A9E7E', fontSize: 14 }}>Mati ${g.parteMati.toFixed(0)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <p className="font-bold text-lg" style={{ color: '#3D2B1F' }}>${g.monto.toFixed(0)}</p>
                  <button
                    onClick={() => setGastos(p => p.filter(x => x.id !== g.id))}
                    className="text-xs px-2 py-1 rounded-lg"
                    style={{ color: '#D4C4B0', background: '#F2E8D9' }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-20 right-5 w-16 h-16 rounded-full shadow-xl flex items-center justify-center z-30 text-3xl text-white transition-transform active:scale-95"
        style={{ background: '#C4785A', boxShadow: '0 4px 20px rgba(196,120,90,0.45)' }}
      >
        +
      </button>

      {/* Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          style={{ background: 'rgba(61,43,31,0.5)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}
        >
          <div
            className="w-full rounded-t-3xl p-6 flex flex-col gap-5 overflow-y-auto"
            style={{ background: '#FFFDF5', maxHeight: '92dvh' }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl" style={{ fontFamily: 'Playfair Display, serif', color: '#3D2B1F', fontStyle: 'italic' }}>
                Nuevo gasto
              </h2>
              <button onClick={() => setShowForm(false)} style={{ color: '#9B8B7A', fontSize: 22 }}>✕</button>
            </div>

            {/* Descripción */}
            <input
              className="w-full rounded-2xl px-5 py-4 text-base outline-none"
              style={{ border: '1.5px solid #D4C4B0', background: '#F2E8D9', color: '#3D2B1F', fontSize: 16 }}
              placeholder="Descripción (ej: Almuerzo en el puerto)"
              value={form.descripcion}
              onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
            />

            {/* Monto + Pagador */}
            <div className="flex gap-3">
              <input
                type="number"
                className="flex-1 rounded-2xl px-5 py-4 text-base outline-none"
                style={{ border: '1.5px solid #D4C4B0', background: '#F2E8D9', color: '#3D2B1F', fontSize: 16 }}
                placeholder="Monto $"
                value={form.monto}
                onChange={e => setForm(f => ({ ...f, monto: e.target.value }))}
              />
              <div className="flex rounded-2xl overflow-hidden" style={{ border: '1.5px solid #D4C4B0' }}>
                {PERSONAS.map(p => (
                  <button
                    key={p}
                    onClick={() => setForm(f => ({ ...f, pagador: p }))}
                    className="flex-1 px-4 py-4 font-hand text-base transition-all"
                    style={{
                      fontSize: 16,
                      background: form.pagador === p ? '#C4785A' : '#F2E8D9',
                      color:      form.pagador === p ? 'white'   : '#8B7355',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Categorías */}
            <div>
              <p className="font-hand text-base mb-3" style={{ color: '#8B7355', fontSize: 16 }}>Categoría</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIAS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setForm(f => ({ ...f, categoria: c.id }))}
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl font-hand transition-all"
                    style={{
                      fontSize: 15,
                      background: form.categoria === c.id ? c.color : '#F2E8D9',
                      color:      form.categoria === c.id ? 'white' : '#8B7355',
                      border:     `1.5px solid ${form.categoria === c.id ? c.color : '#D4C4B0'}`,
                    }}
                  >
                    <span className="text-lg">{c.emoji}</span>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* División */}
            <div>
              <p className="font-hand text-base mb-3" style={{ color: '#8B7355', fontSize: 16 }}>División</p>
              <div className="flex gap-3">
                {['50/50', 'custom'].map(d => (
                  <button
                    key={d}
                    onClick={() => setForm(f => ({ ...f, division: d }))}
                    className="flex-1 py-4 rounded-2xl font-hand text-base transition-all"
                    style={{
                      fontSize: 16,
                      background: form.division === d ? '#8B7355' : '#F2E8D9',
                      color:      form.division === d ? 'white'   : '#8B7355',
                      border:     `1.5px solid ${form.division === d ? '#8B7355' : '#D4C4B0'}`,
                    }}
                  >
                    {d === '50/50' ? '50 / 50' : 'Personalizado'}
                  </button>
                ))}
              </div>
              {form.division === 'custom' && (
                <div className="flex gap-3 mt-3">
                  <input
                    type="number"
                    className="flex-1 rounded-2xl px-4 py-4 text-base outline-none"
                    style={{ border: '1.5px solid #D4C4B0', background: '#F2E8D9', fontSize: 16 }}
                    placeholder="Parte Indi $"
                    value={form.customIndi}
                    onChange={e => setForm(f => ({ ...f, customIndi: e.target.value }))}
                  />
                  <input
                    type="number"
                    className="flex-1 rounded-2xl px-4 py-4 text-base outline-none"
                    style={{ border: '1.5px solid #D4C4B0', background: '#F2E8D9', fontSize: 16 }}
                    placeholder="Parte Mati $"
                    value={form.customMati}
                    onChange={e => setForm(f => ({ ...f, customMati: e.target.value }))}
                  />
                </div>
              )}
            </div>

            <button
              onClick={agregar}
              className="w-full py-5 rounded-2xl text-white font-hand text-lg font-bold transition-all active:scale-95"
              style={{ fontSize: 18, background: '#C4785A', boxShadow: '0 4px 12px rgba(196,120,90,0.3)' }}
            >
              Agregar gasto 💸
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
