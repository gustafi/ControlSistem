/**
 * Página de gerenciamento de pessoas.
 * CRUD completo: criar, listar, editar e excluir pessoas.
 * Ao excluir uma pessoa, todas as suas transações são removidas no backend.
 */
import { useState, useEffect } from 'react'
import { peopleApi } from '../api'
import type { Person } from '../types'
import Pagination from '../components/Pagination'

const PAGE_SIZE = 10

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', age: 0 })
  const [showForm, setShowForm] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const loadPeople = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await peopleApi.getPage(page, pageSize)
      setPeople(data.items)
      setTotalCount(data.totalCount)
      setTotalPages(data.totalPages)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar pessoas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPeople()
  }, [page, pageSize])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    try {
      setError(null)
      if (editingId) {
        await peopleApi.update(editingId, { name: form.name.trim(), age: form.age })
      } else {
        await peopleApi.create({ name: form.name.trim(), age: form.age })
      }
      setForm({ name: '', age: 0 })
      setEditingId(null)
      setShowForm(false)
      loadPeople()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar')
    }
  }

  const handleEdit = (p: Person) => {
    setForm({ name: p.name, age: p.age })
    setEditingId(p.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir esta pessoa? Todas as transações dela serão removidas.')) return
    try {
      setError(null)
      await peopleApi.delete(id)
      if (people.length === 1 && page > 1) {
        setPage(p => p - 1)
      } else {
        loadPeople()
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao excluir')
    }
  }

  const cancelForm = () => {
    setForm({ name: '', age: 0 })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div>
      <h1>Cadastro de Pessoas</h1>
      <p className="text-muted">Gerencie as pessoas do sistema. Ao excluir, todas as transações são removidas.</p>

      {error && (
        <div className="card" style={{ background: 'rgba(248,113,113,0.15)', borderColor: 'var(--color-danger)' }}>
          {error}
        </div>
      )}

      <div className="card">
        <h2>{editingId ? 'Editar Pessoa' : 'Nova Pessoa'}</h2>
        {!showForm ? (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>Adicionar Pessoa</button>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome (máx. 200 caracteres)</label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                maxLength={200}
                required
                placeholder="Nome completo"
              />
            </div>
            <div className="form-group">
              <label>Idade</label>
              <input
                type="number"
                min={0}
                value={form.age || ''}
                onChange={e => setForm(f => ({ ...f, age: parseInt(e.target.value) || 0 }))}
                required
              />
            </div>
            <div className="actions mt-2">
              <button type="submit" className="btn btn-primary">Salvar</button>
              <button type="button" className="btn btn-secondary" onClick={cancelForm}>Cancelar</button>
            </div>
          </form>
        )}
      </div>

      <div className="card">
        <h2>Listagem</h2>
        {loading ? (
          <p>Carregando...</p>
        ) : people.length === 0 ? (
          <p className="text-muted">Nenhuma pessoa cadastrada.</p>
        ) : (
          <>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Nome</th>
                  <th>Idade</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {people.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.age}</td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-secondary" onClick={() => handleEdit(p)}>Editar</button>
                        <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>Excluir</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={v => { setPageSize(v); setPage(1) }}
          />
          </>
        )}
      </div>
    </div>
  )
}
