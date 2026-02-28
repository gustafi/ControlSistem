/**
 * Componente principal da aplicação.
 * Define as rotas e a estrutura de navegação do sistema.
 */
import { Routes, Route, NavLink } from 'react-router-dom'
import './App.css'
import PeoplePage from './pages/PeoplePage'
import CategoriesPage from './pages/CategoriesPage'
import TransactionsPage from './pages/TransactionsPage'
import TotalsByPersonPage from './pages/TotalsByPersonPage'
import TotalsByCategoryPage from './pages/TotalsByCategoryPage'

function App() {
  return (
    <div className="app">
      <nav className="nav">
        <h1 className="nav-title">Controle de Gastos</h1>
        <ul className="nav-links">
          <li><NavLink to="/pessoas" className={({ isActive }) => isActive ? 'active' : ''}>Pessoas</NavLink></li>
          <li><NavLink to="/categorias" className={({ isActive }) => isActive ? 'active' : ''}>Categorias</NavLink></li>
          <li><NavLink to="/transacoes" className={({ isActive }) => isActive ? 'active' : ''}>Transações</NavLink></li>
          <li><NavLink to="/totais-pessoa" className={({ isActive }) => isActive ? 'active' : ''}>Totais por Pessoa</NavLink></li>
          <li><NavLink to="/totais-categoria" className={({ isActive }) => isActive ? 'active' : ''}>Totais por Categoria</NavLink></li>
        </ul>
      </nav>

      <main className="main">
        <Routes>
          <Route path="/" element={<PeoplePage />} />
          <Route path="/pessoas" element={<PeoplePage />} />
          <Route path="/categorias" element={<CategoriesPage />} />
          <Route path="/transacoes" element={<TransactionsPage />} />
          <Route path="/totais-pessoa" element={<TotalsByPersonPage />} />
          <Route path="/totais-categoria" element={<TotalsByCategoryPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
