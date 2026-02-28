/**
 * Cliente API para comunicação com o backend .NET.
 * Base URL usa proxy do Vite em desenvolvimento (/api).
 */

const API_BASE = '/api'

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Erro ${res.status}`)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

/** API de Pessoas - CRUD completo */
export const peopleApi = {
  /** Retorna todas (para dropdowns). Sem paginação. */
  getAll: () => fetchApi<{ id: number; name: string; age: number }[]>('/people'),
  /** Retorna página de pessoas. */
  getPage: (page: number, pageSize: number) =>
    fetchApi<{ items: { id: number; name: string; age: number }[]; totalCount: number; page: number; pageSize: number; totalPages: number }>(
      `/people?page=${page}&pageSize=${pageSize}`
    ),
  getById: (id: number) => fetchApi<{ id: number; name: string; age: number }>(`/people/${id}`),
  create: (data: { name: string; age: number }) =>
    fetchApi<{ id: number; name: string; age: number }>('/people', {
      method: 'POST',
      // Não enviamos o Id no corpo - ele é gerado automaticamente no backend
      body: JSON.stringify(data),
    }),
  update: (id: number, data: { name: string; age: number }) =>
    fetchApi<void>(`/people/${id}`, {
      method: 'PUT',
      // O Id vai apenas na URL, não no corpo
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    fetchApi<void>(`/people/${id}`, { method: 'DELETE' }),
}

/** API de Categorias - criação e listagem */
export const categoriesApi = {
  /** Retorna todas (para dropdowns). Sem paginação. */
  getAll: () => fetchApi<{ id: number; description: string; purpose: string }[]>('/categories'),
  /** Retorna página de categorias. */
  getPage: (page: number, pageSize: number) =>
    fetchApi<{ items: { id: number; description: string; purpose: string }[]; totalCount: number; page: number; pageSize: number; totalPages: number }>(
      `/categories?page=${page}&pageSize=${pageSize}`
    ),
  getById: (id: number) => fetchApi<{ id: number; description: string; purpose: string }>(`/categories/${id}`),
  create: (data: { description: string; purpose: string }) =>
    fetchApi<{ id: number; description: string; purpose: string }>('/categories', {
      method: 'POST',
      // Não enviamos o Id no corpo - ele é gerado automaticamente no backend
      body: JSON.stringify(data),
    }),
}

/** API de Transações - criação e listagem */
export const transactionsApi = {
  /** Retorna todas (para formulários que precisam da lista completa). */
  getAll: () => fetchApi<Array<{
    id: number
    description: string
    value: number
    type: string
    categoryId: number
    personId: number
    category?: { id: number; description: string; purpose: string }
    person?: { id: number; name: string; age: number }
  }>>('/transactions'),
  /** Retorna página de transações. */
  getPage: (page: number, pageSize: number) =>
    fetchApi<{
      items: Array<{
        id: number
        description: string
        value: number
        type: string
        categoryId: number
        personId: number
        category?: { id: number; description: string; purpose: string }
        person?: { id: number; name: string; age: number }
      }>;
      totalCount: number;
      page: number;
      pageSize: number;
      totalPages: number;
    }>(`/transactions?page=${page}&pageSize=${pageSize}`),
  getById: (id: number) => fetchApi<{
    id: number
    description: string
    value: number
    type: string
    categoryId: number
    personId: number
    category?: { id: number; description: string; purpose: string }
    person?: { id: number; name: string; age: number }
  }>(`/transactions/${id}`),
  create: (data: { description: string; value: number; type: string; categoryId: number; personId: number }) =>
    fetchApi<{
      id: number
      description: string
      value: number
      type: string
      categoryId: number
      personId: number
      category?: { id: number; description: string; purpose: string }
      person?: { id: number; name: string; age: number }
    }>('/transactions', {
      method: 'POST',
      // Não enviamos o Id no corpo - ele é gerado automaticamente no backend
      body: JSON.stringify(data),
    }),
}

/** API de Relatórios - totais por pessoa e categoria */
export const reportsApi = {
  getTotalsByPerson: (page?: number, pageSize?: number) => {
    const qs = page != null && pageSize != null ? `?page=${page}&pageSize=${pageSize}` : ''
    return fetchApi<{
      items: Array<{ id: number; name: string; age: number; receitas: number; despesas: number; saldo: number }>
      totalGeral?: { totalReceitas: number; totalDespesas: number; saldoLiquido: number }
      totalCount?: number
      page?: number
      pageSize?: number
      totalPages?: number
    }>(`/reports/totals-by-person${qs}`)
  },
  getTotalsByCategory: (page?: number, pageSize?: number) => {
    const qs = page != null && pageSize != null ? `?page=${page}&pageSize=${pageSize}` : ''
    return fetchApi<{
      items: Array<{ id: number; description: string; purpose: string; receitas: number; despesas: number; saldo: number }>
      totalGeral?: { totalReceitas: number; totalDespesas: number; saldoLiquido: number }
      totalCount?: number
      page?: number
      pageSize?: number
      totalPages?: number
    }>(`/reports/totals-by-category${qs}`)
  },
}
