/**
 * Página de gerenciamento de transações.
 * Funcionalidades: criar e listar transações.
 * Regras: menores de 18 anos só podem registrar despesas.
 * A categoria deve ter finalidade compatível com o tipo (despesa/receita).
 */
import { useState, useEffect } from 'react'
import { transactionsApi, peopleApi, categoriesApi } from '../api'
import type { Person, Category, Transaction } from '../types'
import Pagination from '../components/Pagination'

const PAGE_SIZE = 10

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Array<Transaction & { category?: Category; person?: Person }>>([])
  const [people, setPeople] = useState<Person[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [form, setForm] = useState({
    description: '',
    value: 0,
    type: 'despesa' as 'despesa' | 'receita',
    categoryId: 0,
    personId: 0,
  })

  const loadPeopleAndCategories = async () => {
    const [ppl, cats] = await Promise.all([peopleApi.getAll(), categoriesApi.getAll()])
    setPeople(ppl)
    setCategories(cats)
  }

  const loadTransactions = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await transactionsApi.getPage(page, pageSize)
      setTransactions(data.items)
      setTotalCount(data.totalCount)
      setTotalPages(data.totalPages)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar transações')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPeopleAndCategories()
  }, [])

  useEffect(() => {
    loadTransactions()
  }, [page, pageSize])

  /** Categorias filtradas conforme tipo da transação e finalidade */
  const filteredCategories = categories.filter(c => {
    if (form.type === 'despesa') return c.purpose === 'despesa' || c.purpose === 'ambas'
    return c.purpose === 'receita' || c.purpose === 'ambas'
  })

  /** Se a pessoa selecionada é menor de 18, só despesa é permitida */
  const selectedPerson = people.find(p => p.id === form.personId)
  const isMinor = selectedPerson ? selectedPerson.age < 18 : false

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.description.trim() || form.value <= 0 || !form.categoryId || !form.personId) return
    if (isMinor && form.type === 'receita') {
      setError('Menores de 18 anos podem registrar apenas despesas.')
      return
    }
    try {
      setError(null)
      await transactionsApi.create({
        description: form.description.trim(),
        value: form.value,
        type: form.type,
        categoryId: form.categoryId,
        personId: form.personId,
      })
      setForm({ description: '', value: 0, type: 'despesa', categoryId: 0, personId: 0 })
      loadTransactions()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar')
    }
  }

  return (
    <div>
      <h1>Cadastro de Transações</h1>
      <p className="text-muted">Registre despesas e receitas. Menores de 18 anos só podem registrar despesas.</p>

      {error && (
        <div className="card" style={{ background: 'rgba(248,113,113,0.15)', borderColor: 'var(--color-danger)' }}>
          {error}
        </div>
      )}

      <div className="card">
        <h2>Nova Transação</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Pessoa</label>
            <select
              value={form.personId || ''}
              onChange={e => setForm(f => ({ ...f, personId: parseInt(e.target.value) || 0 }))}
              required
            >
              <option value="">Selecione...</option>
              {people.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.age} anos)</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Tipo</label>
            <select
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value as 'despesa' | 'receita', categoryId: 0 }))}
            >
              <option value="despesa">Despesa</option>
              <option value="receita" disabled={isMinor}>Receita {isMinor ? '(menor de 18)' : ''}</option>
            </select>
          </div>
          <div className="form-group">
            <label>Categoria</label>
            <select
              value={form.categoryId || ''}
              onChange={e => setForm(f => ({ ...f, categoryId: parseInt(e.target.value) || 0 }))}
              required
            >
              <option value="">Selecione...</option>
              {filteredCategories.map(c => (
                <option key={c.id} value={c.id}>{c.description} ({c.purpose})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Descrição (máx. 400 caracteres)</label>
            <input
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              maxLength={400}
              required
              placeholder="Ex: Supermercado, Salário"
            />
          </div>
          <div className="form-group">
            <label>Valor (positivo)</label>
            <input
              type="number"
              min={0.01}
              step={0.01}
              value={form.value || ''}
              onChange={e => setForm(f => ({ ...f, value: parseFloat(e.target.value) || 0 }))}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Criar Transação</button>
        </form>
      </div>

      <div className="card">
        <h2>Listagem</h2>
        {loading ? (
          <p>Carregando...</p>
        ) : transactions.length === 0 ? (
          <p className="text-muted">Nenhuma transação cadastrada.</p>
        ) : (
          <>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Tipo</th>
                  <th>Pessoa</th>
                  <th>Categoria</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.description}</td>
                    <td className={t.type === 'receita' ? 'text-success' : 'text-danger'}>
                      {t.type === 'receita' ? '+' : '-'} R$ {t.value.toFixed(2)}
                    </td>
                    <td>{t.type}</td>
                    <td>{t.person?.name ?? t.personId}</td>
                    <td>{t.category?.description ?? t.categoryId}</td>
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
