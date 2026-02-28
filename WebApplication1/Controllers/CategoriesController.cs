using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;
using WebApplication1.DTOs;

namespace WebApplication1.Controllers;

/// <summary>
/// Controller responsável pelo cadastro de categorias.
/// Funcionalidades: criação e listagem (sem edição/deleção conforme requisito).
/// A finalidade (despesa/receita/ambas) restringe o uso da categoria nas transações.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ExpenseControlDbContext _context;

    public CategoriesController(ExpenseControlDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Lista todas as categorias cadastradas.
    /// </summary>
[HttpGet]
public async Task<ActionResult<PagedResultDto<CategoryResponseDto>>> GetAll(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10)
{
    if (page < 1) page = 1;
    if (pageSize < 1) pageSize = 10;
    if (pageSize > 100) pageSize = 100;

    var query = _context.Categories
        .OrderBy(c => c.Description);

    var totalItems = await query.CountAsync();

    var items = await query
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .Select(c => new CategoryResponseDto
        {
            Id = c.Id,
            Description = c.Description,
            Purpose = c.Purpose
        })
        .ToListAsync();

    var result = new PagedResultDto<CategoryResponseDto>
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
    /// Obtém uma categoria pelo identificador.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Category>> GetById(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
            return NotFound();

        return category;
    }

    /// <summary>
    /// Cria uma nova categoria. O Id é gerado automaticamente.
    /// Validações: Descrição (máx 400 chars), Finalidade (despesa/receita/ambas).
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Category>> Create([FromBody] CreateCategoryDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Description) || dto.Description.Length > 400)
            return BadRequest("Descrição é obrigatória e deve ter no máximo 400 caracteres.");

        var purpose = dto.Purpose?.ToLowerInvariant().Trim() ?? "";
        if (purpose != "despesa" && purpose != "receita" && purpose != "ambas")
            return BadRequest("Finalidade deve ser: despesa, receita ou ambas.");

        var category = new Category
        {
            Description = dto.Description.Trim(),
            Purpose = purpose
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
    }
}
