/**
 * Componente de paginação reutilizável.
 */
interface PaginationProps {
  page: number
  totalPages: number
  totalCount: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
}

export default function Pagination({
  page,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
}: PaginationProps) {
  const start = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalCount)

  return (
    <div className="pagination" style={paginationStyle}>
      <div className="pagination-info" style={infoStyle}>
        Exibindo {start}-{end} de {totalCount}
      </div>
      {onPageSizeChange && (
        <div className="pagination-size" style={sizeStyle}>
          <label htmlFor="pageSize">Por página:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={e => onPageSizeChange(Number(e.target.value))}
            style={selectStyle}
          >
            {pageSizeOptions.map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      )}
      <div className="pagination-buttons" style={buttonsStyle}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
        >
          « Primeira
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          ‹ Anterior
        </button>
        <span style={pageInfoStyle}>
          Página {page} de {totalPages || 1}
        </span>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || totalPages === 0}
        >
          Próxima ›
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages || totalPages === 0}
        >
          Última »
        </button>
      </div>
    </div>
  )
}

const paginationStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '1rem',
  marginTop: '1rem',
  padding: '0.75rem 0',
}
const infoStyle: React.CSSProperties = { color: 'var(--color-text-muted)', fontSize: '0.9rem' }
const sizeStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem' }
const selectStyle: React.CSSProperties = {
  padding: '0.35rem 0.5rem',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--color-border)',
  background: 'var(--color-surface)',
  color: 'var(--color-text)',
}
const buttonsStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  flexWrap: 'wrap',
}
const pageInfoStyle: React.CSSProperties = {
  padding: '0 0.5rem',
  color: 'var(--color-text-muted)',
  fontSize: '0.9rem',
}
