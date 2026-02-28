/**
 * Página de consulta de totais por categoria.
 * Lista categorias com total de receitas, despesas e saldo.
 * Exibe o total geral ao final. Suporta paginação.
 */
import { useState, useEffect } from 'react'
import { reportsApi } from '../api'
import type { TotalByCategoryItem } from '../types'
import Pagination from '../components/Pagination'

const PAGE_SIZE = 10

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export default function TotalsByCategoryPage() {
  const [items, setItems] = useState<TotalByCategoryItem[]>([])
  const [totalGeral, setTotalGeral] = useState<{ totalReceitas: number; totalDespesas: number; saldoLiquido: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    reportsApi.getTotalsByCategory(page, pageSize)
      .then(res => {
        setItems(res.items)
        setTotalGeral(res.totalGeral ?? null)
        if (res.totalCount != null) setTotalCount(res.totalCount)
        if (res.totalPages != null) setTotalPages(res.totalPages)
      })
      .catch(e => setError(e instanceof Error ? e.message : 'Erro ao carregar'))
      .finally(() => setLoading(false))
  }, [page, pageSize])

  if (loading) return <p>Carregando...</p>
  if (error) return <div className="card" style={{ background: 'rgba(248,113,113,0.15)' }}>{error}</div>

  return (
    <div>
      <h1>Totais por Categoria</h1>
      <p className="text-muted">Receitas, despesas e saldo por categoria, com total geral ao final.</p>

      <div className="card">
        <h2>Resumo por Categoria</h2>
        {items.length === 0 ? (
          <p className="text-muted">Nenhuma categoria cadastrada.</p>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Categoria</th>
                    <th>Finalidade</th>
                    <th>Receitas</th>
                    <th>Despesas</th>
                    <th>Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id}>
                      <td>{item.description}</td>
                      <td>{item.purpose}</td>
                      <td className="text-success">{formatCurrency(item.receitas)}</td>
                      <td className="text-danger">{formatCurrency(item.despesas)}</td>
                      <td className={item.saldo >= 0 ? 'text-success' : 'text-danger'}>
                        {formatCurrency(item.saldo)}
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
            {totalGeral && (
            <div className="card mt-2" style={{ background: 'var(--color-bg)', marginTop: '1rem' }}>
              <h2>Total Geral</h2>
              <p><strong>Total Receitas:</strong> <span className="text-success">{formatCurrency(totalGeral.totalReceitas)}</span></p>
              <p><strong>Total Despesas:</strong> <span className="text-danger">{formatCurrency(totalGeral.totalDespesas)}</span></p>
              <p><strong>Saldo Líquido:</strong> <span className={totalGeral.saldoLiquido >= 0 ? 'text-success' : 'text-danger'}>{formatCurrency(totalGeral.saldoLiquido)}</span></p>
            </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
