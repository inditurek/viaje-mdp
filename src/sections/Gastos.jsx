import { useState } from 'react'
import { useStorage } from '../hooks/useStorage'

const CATEGORIAS = [
  { id: 'comida', label: 'Comida', emoji: '🍕', color: '#FF6B6B' },
  { id: 'alojamiento', label: 'Alojamiento', emoji: '🏨', color: '#4ECDC4' },
  { id: 'actividades', label: 'Actividades', emoji: '🎭', color: '#FFB347' },
  { id: 'transporte', label: 'Transporte', emoji: '🚌', color: '#FF9ECD' },
  { id: 'otro', label: 'Otro', emoji: '✨', color: '#9CA3AF' },
]

const PERSONAS = ['Indi', 'Vos']

const EMPTY_FORM = {
  descripcion: '',
  monto: '',
  pagador: 'Indi',
  categoria: 'comida',
  division: '50/50',
  customIndi: '',
  customVos: '',
}

export default function Gastos() {
  const [gastos, setGastos] = useStorage('gastos', [])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [filtro, setFiltro] = useState('todos')

  function agregarGasto() {
    if (!form.descripcion || !form.monto) return
    const monto = parseFloat(form.monto)
    let parteIndi, parteVos
    if (form.division === '50/50') {
      parteIndi = monto / 2
      parteVos = monto / 2
    } else {
      parteIndi = parseFloat(form.customIndi) || 0
      parteVos = parseFloat(form.customVos) || 0
    }
    setGastos(prev => [{
      id: Date.now(),
      descripcion: form.descripcion,
      monto,
      pagador: form.pagador,
      categoria: form.categoria,
      parteIndi,
      parteVos,
      fecha: new Date().toLocaleDateString('es-AR'),
    }, ...prev])
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  function eliminarGasto(id) {
    setGastos(prev => prev.filter(g => g.id !== id))
  }

  // Balance: cuánto debe cada uno al otro
  const balance = gastos.reduce((acc, g) => {
    if (g.pagador === 'Indi') {
      // Indi pagó, Vos le debe su parte
      acc.vosDebeAIndi += g.parteVos
    } else {
      // Vos pagó, Indi le debe su parte
      acc.indiDebeAVos += g.parteIndi
    }
    return acc
  }, { vosDebeAIndi: 0, indiDebeAVos: 0 })

  const diferencia = balance.vosDebeAIndi - balance.indiDebeAVos
  let balanceTexto = ''
  if (diferencia > 0.01) balanceTexto = `Vos le debés $${diferencia.toFixed(0)} a Indi`
  else if (diferencia < -0.01) balanceTexto = `Indi te debe $${Math.abs(diferencia).toFixed(0)}`
  else balanceTexto = '¡Están al día! 🎉'

  const cat = CATEGORIAS.find(c => c.id === form.categoria)
  const gastosFiltrados = filtro === 'todos' ? gastos : gastos.filter(g => g.categoria === filtro)

  // Resumen por categoría
  const resumen = CATEGORIAS.map(c => ({
    ...c,
    total: gastos.filter(g => g.categoria === c.id).reduce((s, g) => s + g.monto, 0),
  })).filter(c => c.total > 0)

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Balance */}
      <div
        className="mx-4 mt-4 rounded-3xl p-5 text-white text-center shadow-lg"
        style={{ background: 'linear-gradient(135deg, #FF6B6B, #FF9ECD)' }}
      >
        <p className="text-white/80 text-sm">Balance actual</p>
        <p className="text-2xl font-bold mt-1" style={{ fontFamily: 'Comfortaa' }}>{balanceTexto}</p>
        <div className="flex justify-around mt-4 text-sm">
          <div>
            <p className="text-white/70">Total gastado</p>
            <p className="font-bold text-lg">${gastos.reduce((s, g) => s + g.monto, 0).toFixed(0)}</p>
          </div>
          <div className="w-px bg-white/30" />
          <div>
            <p className="text-white/70">Indi pagó</p>
            <p className="font-bold text-lg">${gastos.filter(g => g.pagador === 'Indi').reduce((s, g) => s + g.monto, 0).toFixed(0)}</p>
          </div>
          <div className="w-px bg-white/30" />
          <div>
            <p className="text-white/70">Vos pagaste</p>
            <p className="font-bold text-lg">${gastos.filter(g => g.pagador === 'Vos').reduce((s, g) => s + g.monto, 0).toFixed(0)}</p>
          </div>
        </div>
      </div>

      {/* Resumen por categoría */}
      {resumen.length > 0 && (
        <div className="mx-4 flex gap-2 flex-wrap">
          {resumen.map(c => (
            <div
              key={c.id}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
              style={{ background: c.color + '20', color: c.color }}
            >
              <span>{c.emoji}</span>
              <span>${c.total.toFixed(0)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Filtros */}
      <div className="mx-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setFiltro('todos')}
          className="px-4 py-1.5 rounded-full text-sm whitespace-nowrap font-medium transition-all"
          style={{ background: filtro === 'todos' ? '#FF6B6B' : '#F3F4F6', color: filtro === 'todos' ? 'white' : '#374151' }}
        >
          Todos
        </button>
        {CATEGORIAS.map(c => (
          <button
            key={c.id}
            onClick={() => setFiltro(c.id)}
            className="px-4 py-1.5 rounded-full text-sm whitespace-nowrap font-medium transition-all"
            style={{ background: filtro === c.id ? c.color : '#F3F4F6', color: filtro === c.id ? 'white' : '#374151' }}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="mx-4 flex flex-col gap-3">
        {gastosFiltrados.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">💸</p>
            <p>Todavía no hay gastos registrados</p>
          </div>
        ) : (
          gastosFiltrados.map(g => {
            const c = CATEGORIAS.find(x => x.id === g.categoria) || CATEGORIAS[4]
            return (
              <div
                key={g.id}
                className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3"
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: c.color + '20' }}
                >
                  {c.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{g.descripcion}</p>
                  <p className="text-xs text-gray-400">Pagó {g.pagador} · {g.fecha}</p>
                  <div className="flex gap-2 mt-1 text-xs">
                    <span style={{ color: '#FF6B6B' }}>Indi: ${g.parteIndi.toFixed(0)}</span>
                    <span className="text-gray-300">·</span>
                    <span style={{ color: '#4ECDC4' }}>Vos: ${g.parteVos.toFixed(0)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">${g.monto.toFixed(0)}</p>
                  <button onClick={() => eliminarGasto(g.id)} className="text-xs text-gray-300 mt-1">✕</button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-xl text-white text-3xl flex items-center justify-center z-30 transition-transform active:scale-95"
        style={{ background: 'linear-gradient(135deg, #FF6B6B, #FF9ECD)' }}
      >
        +
      </button>

      {/* Modal agregar gasto */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full bg-white rounded-t-3xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold" style={{ fontFamily: 'Comfortaa', color: '#FF6B6B' }}>
                Nuevo gasto
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 text-xl">✕</button>
            </div>

            <input
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-base outline-none focus:border-pink-300"
              placeholder="Descripción (ej: Almuerzo en la rambla)"
              value={form.descripcion}
              onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
            />

            <div className="flex gap-3">
              <input
                type="number"
                className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 text-base outline-none focus:border-pink-300"
                placeholder="Monto $"
                value={form.monto}
                onChange={e => setForm(f => ({ ...f, monto: e.target.value }))}
              />
              <select
                className="flex-1 border border-gray-200 rounded-2xl px-3 py-3 text-base outline-none bg-white"
                value={form.pagador}
                onChange={e => setForm(f => ({ ...f, pagador: e.target.value }))}
              >
                {PERSONAS.map(p => <option key={p} value={p}>Pagó {p}</option>)}
              </select>
            </div>

            {/* Categorías */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Categoría</p>
              <div className="flex gap-2 flex-wrap">
                {CATEGORIAS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setForm(f => ({ ...f, categoria: c.id }))}
                    className="px-3 py-2 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: form.categoria === c.id ? c.color : '#F3F4F6',
                      color: form.categoria === c.id ? 'white' : '#374151',
                    }}
                  >
                    {c.emoji} {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* División */}
            <div>
              <p className="text-sm text-gray-500 mb-2">División</p>
              <div className="flex gap-3">
                {['50/50', 'custom'].map(d => (
                  <button
                    key={d}
                    onClick={() => setForm(f => ({ ...f, division: d }))}
                    className="flex-1 py-2 rounded-xl text-sm font-medium border transition-all"
                    style={{
                      background: form.division === d ? '#FF6B6B' : 'white',
                      color: form.division === d ? 'white' : '#374151',
                      borderColor: form.division === d ? '#FF6B6B' : '#E5E7EB',
                    }}
                  >
                    {d === '50/50' ? '50/50' : 'Personalizado'}
                  </button>
                ))}
              </div>
              {form.division === 'custom' && (
                <div className="flex gap-3 mt-3">
                  <input
                    type="number"
                    className="flex-1 border border-gray-200 rounded-2xl px-4 py-2 text-sm outline-none"
                    placeholder="Parte Indi $"
                    value={form.customIndi}
                    onChange={e => setForm(f => ({ ...f, customIndi: e.target.value }))}
                  />
                  <input
                    type="number"
                    className="flex-1 border border-gray-200 rounded-2xl px-4 py-2 text-sm outline-none"
                    placeholder="Tu parte $"
                    value={form.customVos}
                    onChange={e => setForm(f => ({ ...f, customVos: e.target.value }))}
                  />
                </div>
              )}
            </div>

            <button
              onClick={agregarGasto}
              className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #FF6B6B, #FF9ECD)' }}
            >
              Agregar gasto 💸
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
