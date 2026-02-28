using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;
using WebApplication1.DTOs;

namespace WebApplication1.Controllers;

/// <summary>
/// Controller responsável pelo CRUD de pessoas no sistema de controle de gastos.
/// Funcionalidades: criação, edição, deleção e listagem.
/// Ao deletar uma pessoa, todas as suas transações são removidas em cascata.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PeopleController : ControllerBase
{
    private readonly ExpenseControlDbContext _context;

    public PeopleController(ExpenseControlDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Lista todas as pessoas cadastradas.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PagedResultDto<PersonResponseDto>>> GetAll(
    int page = 1,
    int pageSize = 10)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;

        var query = _context.People.AsNoTracking();

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderBy(p => p.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new PersonResponseDto
            {
                Id = p.Id,
                Name = p.Name,
                Age = p.Age,

            })
            .ToListAsync();

    var result = new PagedResultDto<PersonResponseDto>
    {
        Page = page,
        PageSize = pageSize,
        TotalItems = totalCount,
        TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
        Items = items
    };

        return Ok(result);
    }

    /// <summary>
    /// Obtém uma pessoa pelo identificador.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Person>> GetById(int id)
    {
        var person = await _context.People.FindAsync(id);
        if (person == null)
            return NotFound();

        return person;
    }

    /// <summary>
    /// Cria uma nova pessoa. O Id é gerado automaticamente.
    /// Validações: Nome (máx 200 chars), Idade (obrigatória).
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Person>> Create([FromBody] CreatePersonDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name) || dto.Name.Length > 200)
            return BadRequest("Nome é obrigatório e deve ter no máximo 200 caracteres.");

        if (dto.Age < 0)
            return BadRequest("Idade deve ser um valor não negativo.");

        var person = new Person
        {
            Name = dto.Name.Trim(),
            Age = dto.Age
        };

        _context.People.Add(person);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = person.Id }, person);
    }

    /// <summary>
    /// Atualiza uma pessoa existente.
    /// O identificador é recebido apenas pela URL, não no corpo.
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdatePersonDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name) || dto.Name.Length > 200)
            return BadRequest("Nome é obrigatório e deve ter no máximo 200 caracteres.");

        if (dto.Age < 0)
            return BadRequest("Idade deve ser um valor não negativo.");

        var existing = await _context.People.FindAsync(id);
        if (existing == null)
            return NotFound();

        existing.Name = dto.Name.Trim();
        existing.Age = dto.Age;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>
    /// Remove uma pessoa. Todas as transações associadas são deletadas em cascata.
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var person = await _context.People.FindAsync(id);
        if (person == null)
            return NotFound();

        _context.People.Remove(person);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
