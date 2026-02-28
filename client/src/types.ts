/**
 * Tipos TypeScript para as entidades do sistema de controle de gastos.
 * Espelham os modelos do backend C#.
 */

/** Pessoa cadastrada no sistema */
export interface Person {
  id: number
  name: string
  age: number
}

/** Categoria para classificação de transações (despesa/receita/ambas) */
export interface Category {
  id: number
  description: string
  purpose: string
}

/** Transação financeira vinculada a pessoa e categoria */
export interface Transaction {
  id: number
  description: string
  value: number
  type: string
  categoryId: number
  personId: number
  category?: Category
  person?: Person
}

/** Item da consulta de totais por pessoa */
export interface TotalByPersonItem {
  id: number
  name: string
  age: number
  receitas: number
  despesas: number
  saldo: number
}

/** Item da consulta de totais por categoria */
export interface TotalByCategoryItem {
  id: number
  description: string
  purpose: string
  receitas: number
  despesas: number
  saldo: number
}

/** Resposta da API de totais por pessoa */
export interface TotalsByPersonResponse {
  items: TotalByPersonItem[]
  totalGeral: {
    totalReceitas: number
    totalDespesas: number
    saldoLiquido: number
  }
}

/** Resposta da API de totais por categoria */
export interface TotalsByCategoryResponse {
  items: TotalByCategoryItem[]
  totalGeral: {
    totalReceitas: number
    totalDespesas: number
    saldoLiquido: number
  }
}

/** Resposta paginada genérica */
export interface PagedResponse<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}
