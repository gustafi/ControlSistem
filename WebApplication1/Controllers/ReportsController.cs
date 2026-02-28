using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;

namespace WebApplication1.Controllers;

/// <summary>
/// Controller responsável pelas consultas de totais do sistema.
/// - Totais por pessoa: receitas, despesas e saldo de cada pessoa + total geral.
/// - Totais por categoria: receitas, despesas e saldo de cada categoria + total geral.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly ExpenseControlDbContext _context;

    public ReportsController(ExpenseControlDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Lista todas as pessoas com total de receitas, despesas e saldo (receita - despesa).
    /// Inclui ao final o total geral de todas as pessoas.
    /// </summary>
    [HttpGet("totals-by-person")]
    public async Task<ActionResult<object>> GetTotalsByPerson()
    {
        var people = await _context.People
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Age,
                Receitas = p.Transactions.Where(t => t.Type == "receita").Sum(t => t.Value),
                Despesas = p.Transactions.Where(t => t.Type == "despesa").Sum(t => t.Value)
            })
            .ToListAsync();

        var items = people.Select(p => new
        {
            p.Id,
            p.Name,
            p.Age,
            p.Receitas,
            p.Despesas,
            Saldo = p.Receitas - p.Despesas
        }).ToList();

        var totalReceitas = items.Sum(i => i.Receitas);
        var totalDespesas = items.Sum(i => i.Despesas);
        var saldoLiquido = totalReceitas - totalDespesas;

        return Ok(new
        {
            Items = items,
            TotalGeral = new
            {
                TotalReceitas = totalReceitas,
                TotalDespesas = totalDespesas,
                SaldoLiquido = saldoLiquido
            }
        });
    }

    /// <summary>
    /// Lista todas as categorias com total de receitas, despesas e saldo (receita - despesa).
    /// Inclui ao final o total geral de todas as categorias.
    /// </summary>
    [HttpGet("totals-by-category")]
    public async Task<ActionResult<object>> GetTotalsByCategory()
    {
        var categories = await _context.Categories
            .Select(c => new
            {
                c.Id,
                c.Description,
                c.Purpose,
                Receitas = c.Transactions.Where(t => t.Type == "receita").Sum(t => t.Value),
                Despesas = c.Transactions.Where(t => t.Type == "despesa").Sum(t => t.Value)
            })
            .ToListAsync();

        var items = categories.Select(c => new
        {
            c.Id,
            c.Description,
            c.Purpose,
            c.Receitas,
            c.Despesas,
            Saldo = c.Receitas - c.Despesas
        }).ToList();

        var totalReceitas = items.Sum(i => i.Receitas);
        var totalDespesas = items.Sum(i => i.Despesas);
        var saldoLiquido = totalReceitas - totalDespesas;

        return Ok(new
        {
            Items = items,
            TotalGeral = new
            {
                TotalReceitas = totalReceitas,
                TotalDespesas = totalDespesas,
                SaldoLiquido = saldoLiquido
            }
        });
    }
}
