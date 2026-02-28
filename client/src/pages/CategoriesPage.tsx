/**
 * Página de gerenciamento de categorias.
 * Funcionalidades: criar e listar categorias.
 * A finalidade (despesa/receita/ambas) define onde a categoria pode ser usada nas transações.
 */
import { useState, useEffect } from 'react'
import { categoriesApi } from '../api'
import type { Category } from '../types'
import Pagination from '../components/Pagination'

const PAGE_SIZE = 10

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ description: '', purpose: 'ambas' })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const loadCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await categoriesApi.getPage(page, pageSize)
      setCategories(data.items)
      setTotalCount(data.totalCount)
      setTotalPages(data.totalPages)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar categorias')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [page, pageSize])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.description.trim()) return
    try {
      setError(null)
      await categoriesApi.create({
        description: form.description.trim(),
        purpose: form.purpose,
      })
      setForm({ description: '', purpose: 'ambas' })
      loadCategories()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar')
    }
  }

  return (
    <div>
      <h1>Cadastro de Categorias</h1>
      <p className="text-muted">Crie categorias para classificar transações. A finalidade define se pode ser usada em despesas, receitas ou ambas.</p>

      {error && (
        <div className="card" style={{ background: 'rgba(248,113,113,0.15)', borderColor: 'var(--color-danger)' }}>
          {error}
        </div>
      )}

      <div className="card">
        <h2>Nova Categoria</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Descrição (máx. 400 caracteres)</label>
            <input
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              maxLength={400}
              required
              placeholder="Ex: Alimentação, Salário"
            />
          </div>
          <div className="form-group">
            <label>Finalidade</label>
            <select
              value={form.purpose}
              onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))}
            >
              <option value="despesa">Despesa</option>
              <option value="receita">Receita</option>
              <option value="ambas">Ambas</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Criar Categoria</button>
        </form>
      </div>

      <div className="card">
        <h2>Listagem</h2>
        {loading ? (
          <p>Carregando...</p>
        ) : categories.length === 0 ? (
          <p className="text-muted">Nenhuma categoria cadastrada.</p>
        ) : (
          <>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Descrição</th>
                  <th>Finalidade</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(c => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.description}</td>
                    <td>{c.purpose}</td>
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
