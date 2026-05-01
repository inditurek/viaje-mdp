import { useState } from 'react'
import { useStorage } from '../hooks/useStorage'

const CATEGORIAS = [
  { id: 'comida',      label: 'Comida',      emoji: '🍽️', color: '#C4785A' },
  { id: 'cafe',        label: 'Café',        emoji: '☕',  color: '#8B7355' },
  { id: 'actividades', label: 'Actividades', emoji: '🎭',  color: '#7A9E7E' },
  { id: 'transporte',  label: 'Transporte',  emoji: '🚌',  color: '#9B8B7A' },
  { id: 'otro',        label: 'Otro',        emoji: '✨',  color: '#D4A0A0' },
]

const TODOS_FILTROS = [{ id: 'todos', label: 'Todos', emoji: '🗂️', color: '#8B7355' }, ...CATEGORIAS]

const EMPTY = {
  descripcion: '', monto: '', pagador: 'Indi',
  categoria: 'comida', division: '50/50',
  customIndi: '', customMati: '',
}

export default function Gastos() {
  const [gastos, setGastos] = useStorage('gastos', [])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState(EMPTY)
  const [filtro, setFiltro]     = useState('todos')

  function agregar() {
    if (!form.descripcion || !form.monto) return
    const monto    = parseFloat(form.monto)
    const parteIndi = form.division === '50/50' ? monto / 2 : parseFloat(form.customIndi) || 0
    const parteMati = form.division === '50/50' ? monto / 2 : parseFloat(form.customMati) || 0
    setGastos(prev => [{
      id: Date.now(), descripcion: form.descripcion, monto,
      pagador: form.pagador, categoria: form.categoria,
      parteIndi, parteMati,
      fecha: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }),
    }, ...prev])
    setForm(EMPTY)
    setShowForm(false)
  }

  const bal = gastos.reduce(
    (a, g) => { if (g.pagador === 'Indi') a.matiDebeAIndi += g.parteMati; else a.indiDebeAMati += g.parteIndi; return a },
    { matiDebeAIndi: 0, indiDebeAMati: 0 }
  )
  const dif      = bal.matiDebeAIndi - bal.indiDebeAMati
  const balTexto = dif > 0.01 ? `Mati le debe $${dif.toFixed(0)} a Indi`
    : dif < -0.01  ? `Indi le debe $${Math.abs(dif).toFixed(0)} a Mati`
    : '¡Están al día! 🎉'

  const filtrados = filtro === 'todos' ? gastos : gastos.filter(g => g.categoria === filtro)

  // Estilos reutilizables
  const inputStyle = {
    fontFamily: 'Lato, sans-serif',
    border: '1.5px solid #D4C4B0', background: '#FAF6EF',
    color: '#3D2B1F', borderRadius: 14, padding: '13px 18px',
    width: '100%', outline: 'none', display: 'block',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 16 }}>

      {/* ── Balance ── */}
      <div style={{ margin: '0 16px', borderRadius: 20, padding: '18px 20px', background: '#C4785A', flexShrink: 0 }}>
        <p style={{ fontFamily: 'Lato, sans-serif', color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>Balance actual</p>
        <p style={{
          fontFamily: 'Playfair Display, serif', fontStyle: 'italic',
          color: 'white', fontSize: 20, marginTop: 4,
          // Evitar overflow en pantallas chicas
          overflowWrap: 'break-word', wordBreak: 'break-word',
        }}>
          {balTexto}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          {[
            { label: 'Total',      valor: `$${gastos.reduce((s,g)=>s+g.monto,0).toFixed(0)}` },
            { label: 'Indi pagó',  valor: `$${gastos.filter(g=>g.pagador==='Indi').reduce((s,g)=>s+g.monto,0).toFixed(0)}` },
            { label: 'Mati pagó',  valor: `$${gastos.filter(g=>g.pagador==='Mati').reduce((s,g)=>s+g.monto,0).toFixed(0)}` },
          ].map(({ label, valor }) => (
            <div key={label} style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: 'Lato, sans-serif' }}>{label}</p>
              <p style={{ color: 'white', fontSize: 18, fontWeight: 700, fontFamily: 'Lato, sans-serif' }}>{valor}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filtros horizontales ── */}
      <div className="no-scrollbar"
        style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 16px 4px' }}>
        {TODOS_FILTROS.map(c => (
          <button key={c.id} onClick={() => setFiltro(c.id)}
            style={{
              fontFamily: 'Lato, sans-serif', flexShrink: 0,
              padding: '8px 14px', borderRadius: 50, fontSize: 13,
              fontWeight: filtro === c.id ? 700 : 400, whiteSpace: 'nowrap',
              background: filtro === c.id ? c.color : '#FFFFFF',
              color:      filtro === c.id ? 'white' : '#8B7355',
              border:     `1.5px solid ${filtro === c.id ? c.color : '#D4C4B0'}`,
            }}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {/* ── Lista ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px' }}>
        {filtrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#9B8B7A' }}>
            <p style={{ fontSize: 44, marginBottom: 12 }}>💸</p>
            <p style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: 18, color: '#8B7355' }}>
              Todavía no hay gastos
            </p>
          </div>
        ) : filtrados.map(g => {
          const cat = CATEGORIAS.find(c => c.id === g.categoria) || CATEGORIAS[4]
          return (
            <div key={g.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: '#FFFFFF', borderRadius: 18, padding: '14px 14px',
              border: '1.5px solid #D4C4B0', boxShadow: '0 1px 4px rgba(61,43,31,0.04)',
            }}>
              {/* Ícono categoría */}
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: cat.color + '18', fontSize: 22,
              }}>
                {cat.emoji}
              </div>
              {/* Info — ocupa todo el espacio disponible */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontFamily: 'Lato, sans-serif', fontWeight: 700, fontSize: 15,
                  color: '#3D2B1F', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {g.descripcion}
                </p>
                <p style={{ fontFamily: 'Lato, sans-serif', color: '#9B8B7A', fontSize: 12, marginTop: 2 }}>
                  Pagó {g.pagador} · {g.fecha}
                </p>
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <span style={{ fontFamily: 'Lato, sans-serif', color: '#C4785A', fontSize: 12 }}>Indi ${g.parteIndi.toFixed(0)}</span>
                  <span style={{ color: '#D4C4B0' }}>·</span>
                  <span style={{ fontFamily: 'Lato, sans-serif', color: '#7A9E7E', fontSize: 12 }}>Mati ${g.parteMati.toFixed(0)}</span>
                </div>
              </div>
              {/* Monto + borrar */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 700, fontSize: 16, color: '#3D2B1F' }}>
                  ${g.monto.toFixed(0)}
                </p>
                <button onClick={() => setGastos(p => p.filter(x => x.id !== g.id))}
                  style={{ fontFamily: 'Lato, sans-serif', fontSize: 12, color: '#C4B0A0', background: '#FAF6EF', border: 'none', borderRadius: 8, padding: '2px 8px', cursor: 'pointer' }}>
                  ✕
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── FAB ── */}
      <button onClick={() => setShowForm(true)}
        className="fixed z-30"
        style={{
          bottom: 'calc(68px + env(safe-area-inset-bottom, 0px))',
          right: 20,
          width: 56, height: 56, borderRadius: 28,
          background: '#C4785A', color: 'white', fontSize: 28,
          boxShadow: '0 4px 20px rgba(196,120,90,0.42)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
        +
      </button>

      {/* ── Modal nuevo gasto ── */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          style={{ background: 'rgba(61,43,31,0.5)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}
        >
          <div
            className="w-full"
            style={{
              background: '#FFFFFF', borderRadius: '24px 24px 0 0',
              maxHeight: '92dvh', display: 'flex', flexDirection: 'column',
            }}
          >
            {/* Contenido scrolleable */}
            <div style={{
              overflowY: 'auto', WebkitOverflowScrolling: 'touch',
              padding: '24px 20px 16px', display: 'flex', flexDirection: 'column', gap: 18, flex: 1,
            }}>
              {/* Título */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: 22, color: '#3D2B1F' }}>
                  Nuevo gasto
                </h2>
                <button onClick={() => setShowForm(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, color: '#9B8B7A', lineHeight: 1, padding: 4 }}>
                  ✕
                </button>
              </div>

              {/* Descripción */}
              <input style={inputStyle} placeholder="Descripción (ej: Almuerzo en el puerto)"
                value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />

              {/* Monto */}
              <input type="number" style={inputStyle} placeholder="Monto $"
                value={form.monto} onChange={e => setForm(f => ({ ...f, monto: e.target.value }))} />

              {/* Pagador */}
              <div>
                <p style={{ fontFamily: 'Lato, sans-serif', color: '#8B7355', fontSize: 14, marginBottom: 10 }}>¿Quién pagó?</p>
                <div style={{ display: 'flex', gap: 12 }}>
                  {['Indi', 'Mati'].map(p => (
                    <button key={p} onClick={() => setForm(f => ({ ...f, pagador: p }))}
                      style={{
                        flex: 1, fontFamily: 'Lato, sans-serif', fontSize: 16, fontWeight: 700,
                        padding: '14px 0', borderRadius: 14, border: '1.5px solid',
                        cursor: 'pointer', transition: 'all 0.15s',
                        background: form.pagador === p ? '#C4785A' : '#FAF6EF',
                        color:      form.pagador === p ? 'white'   : '#8B7355',
                        borderColor: form.pagador === p ? '#C4785A' : '#D4C4B0',
                      }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categoría */}
              <div>
                <p style={{ fontFamily: 'Lato, sans-serif', color: '#8B7355', fontSize: 14, marginBottom: 10 }}>Categoría</p>
                <div className="no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                  {CATEGORIAS.map(c => (
                    <button key={c.id} onClick={() => setForm(f => ({ ...f, categoria: c.id }))}
                      style={{
                        flexShrink: 0, fontFamily: 'Lato, sans-serif', fontSize: 14,
                        padding: '10px 14px', borderRadius: 50, border: '1.5px solid', cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        background:  form.categoria === c.id ? c.color  : '#FAF6EF',
                        color:       form.categoria === c.id ? 'white'  : '#8B7355',
                        borderColor: form.categoria === c.id ? c.color  : '#D4C4B0',
                      }}>
                      {c.emoji} {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* División */}
              <div>
                <p style={{ fontFamily: 'Lato, sans-serif', color: '#8B7355', fontSize: 14, marginBottom: 10 }}>División</p>
                <div style={{ display: 'flex', gap: 12 }}>
                  {[['50/50', '50 / 50'], ['custom', 'Personalizado']].map(([val, label]) => (
                    <button key={val} onClick={() => setForm(f => ({ ...f, division: val }))}
                      style={{
                        flex: 1, fontFamily: 'Lato, sans-serif', fontSize: 15,
                        padding: '13px 0', borderRadius: 14, border: '1.5px solid', cursor: 'pointer',
                        background:  form.division === val ? '#8B7355' : '#FAF6EF',
                        color:       form.division === val ? 'white'   : '#8B7355',
                        borderColor: form.division === val ? '#8B7355' : '#D4C4B0',
                      }}>
                      {label}
                    </button>
                  ))}
                </div>
                {form.division === 'custom' && (
                  <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                    {[['customIndi', 'Parte Indi $'], ['customMati', 'Parte Mati $']].map(([key, ph]) => (
                      <input key={key} type="number"
                        style={{ ...inputStyle, flex: 1, width: 'auto' }}
                        placeholder={ph}
                        value={form[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Botón fijo al fondo del modal */}
            <div style={{
              padding: '12px 20px',
              paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
              borderTop: '1.5px solid #FAF6EF', background: '#FFFFFF', flexShrink: 0,
            }}>
              <button onClick={agregar}
                style={{
                  fontFamily: 'Lato, sans-serif', fontSize: 17, fontWeight: 700,
                  padding: '17px', borderRadius: 16, background: '#C4785A', color: 'white',
                  border: 'none', cursor: 'pointer', width: '100%',
                  boxShadow: '0 4px 12px rgba(196,120,90,0.3)',
                }}>
                Agregar gasto 💸
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
