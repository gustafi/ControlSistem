using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1.Data;

/// <summary>
/// Contexto do Entity Framework para o sistema de controle de gastos residenciais.
/// Utiliza SQLite para persistência - os dados são mantidos no arquivo após reiniciar o sistema.
/// </summary>
public class ExpenseControlDbContext : DbContext
{
    public ExpenseControlDbContext(DbContextOptions<ExpenseControlDbContext> options)
        : base(options)
    {
    }

    /// <summary>
    /// Conjunto de pessoas cadastradas no sistema.
    /// </summary>
    public DbSet<Person> People { get; set; }

    /// <summary>
    /// Conjunto de categorias disponíveis para classificação de transações.
    /// </summary>
    public DbSet<Category> Categories { get; set; }

    /// <summary>
    /// Conjunto de transações financeiras (despesas e receitas).
    /// </summary>
    public DbSet<Transaction> Transactions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuração da entidade Person
        modelBuilder.Entity<Person>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Age).IsRequired();
        });

        // Configuração da entidade Category
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Description).HasMaxLength(400).IsRequired();
            entity.Property(e => e.Purpose).HasMaxLength(50).IsRequired();
        });

        // Configuração da entidade Transaction
        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Value).HasPrecision(18, 2).IsRequired();
            entity.Property(e => e.Type).HasMaxLength(50).IsRequired();

            // Relacionamento com Person - cascata na deleção: ao deletar pessoa, deleta transações
            entity.HasOne(e => e.Person)
                .WithMany(p => p.Transactions)
                .HasForeignKey(e => e.PersonId)
                .OnDelete(DeleteBehavior.Cascade);

            // Relacionamento com Category
            entity.HasOne(e => e.Category)
                .WithMany(c => c.Transactions)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
