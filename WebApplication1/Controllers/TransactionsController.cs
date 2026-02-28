using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;
using WebApplication1.DTOs;

namespace WebApplication1.Controllers;

/// <summary>
/// Controller responsável pelo cadastro de transações.
/// Funcionalidades: criação e listagem.
/// Regras: menores de 18 anos só podem registrar despesas.
/// A categoria deve ter finalidade compatível com o tipo da transação.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly ExpenseControlDbContext _context;

    public TransactionsController(ExpenseControlDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Lista todas as transações cadastradas, incluindo dados de pessoa e categoria.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PagedResultDto<TransactionResponseDto>>> GetAll(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 100) pageSize = 100;

        var query = _context.Transactions
            .Include(t => t.Category)
            .Include(t => t.Person)
            .OrderByDescending(t => t.Id);

        var totalItems = await query.CountAsync();

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new TransactionResponseDto
            {
                Id = t.Id,
                Description = t.Description,
                Value = t.Value,
                Type = t.Type,

                Category = new CategoryResponseDto
                {
                    Id = t.Category.Id,
                    Description = t.Category.Description,
                    Purpose = t.Category.Purpose
                },

                Person = new PersonResponseDto
                {
                    Id = t.Person.Id,
                    Name = t.Person.Name,
                    Age = t.Person.Age
                }
            })
            .ToListAsync();

        var result = new PagedResultDto<TransactionResponseDto>
        {
            Page = page,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
            Items = items
        };

        return Ok(result);
    }

    /// <summary>
    /// Obtém uma transação pelo identificador.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Transaction>> GetById(int id)
    {
        var transaction = await _context.Transactions
            .Include(t => t.Person)
            .Include(t => t.Category)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (transaction == null)
            return NotFound();

        return transaction;
    }

    /// <summary>
    /// Cria uma nova transação. O Id é gerado automaticamente.
    /// Validações: tipo compatível com idade (menor 18 = só despesa),
    /// categoria compatível com tipo, valor positivo, descrição máx 400 chars.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Transaction>> Create([FromBody] CreateTransactionDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Description) || dto.Description.Length > 400)
            return BadRequest("Descrição é obrigatória e deve ter no máximo 400 caracteres.");

        if (dto.Value <= 0)
            return BadRequest("Valor deve ser um número positivo.");

        var type = dto.Type?.ToLowerInvariant().Trim() ?? "";
        if (type != "despesa" && type != "receita")
            return BadRequest("Tipo deve ser: despesa ou receita.");

        var person = await _context.People.FindAsync(dto.PersonId);
        if (person == null)
            return BadRequest("Pessoa não encontrada.");

        var category = await _context.Categories.FindAsync(dto.CategoryId);
        if (category == null)
            return BadRequest("Categoria não encontrada.");

        // Valida compatibilidade entre tipo da transação e finalidade da categoria
        var purpose = category.Purpose.ToLowerInvariant();
        if (type == "despesa" && purpose == "receita")
            return BadRequest("Esta categoria é apenas para receitas. Use uma categoria de despesa ou ambas.");
        if (type == "receita" && purpose == "despesa")
            return BadRequest("Esta categoria é apenas para despesas. Use uma categoria de receita ou ambas.");

        var transaction = new Transaction
        {
            Description = dto.Description.Trim(),
            Value = dto.Value,
            Type = type,
            CategoryId = dto.CategoryId,
            PersonId = dto.PersonId
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        // Recarrega com includes para retornar dados completos
        await _context.Entry(transaction)
            .Reference(t => t.Person).LoadAsync();
        await _context.Entry(transaction)
            .Reference(t => t.Category).LoadAsync();

        var response = new TransactionResponseDto
        {
            Id = transaction.Id,
            Description = dto.Description.Trim(),
            Value = dto.Value,
            Type = type,
            PersonId = person.Id,
            Category = new CategoryResponseDto
            {
                Id = category.Id
            }
        };

        return CreatedAtAction(nameof(GetById), new { id = transaction.Id }, response);
    }
}
