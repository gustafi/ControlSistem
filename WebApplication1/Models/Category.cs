namespace WebApplication1.Models;

/// <summary>
/// Representa uma categoria para classificação de transações.
/// A finalidade define se a categoria pode ser usada para despesas, receitas ou ambas.
/// </summary>
public class Category
{
    /// <summary>
    /// Identificador único numérico gerado automaticamente para a categoria.
    /// Este campo é a chave primária usada em relacionamentos e na API.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Descrição da categoria. Tamanho máximo: 400 caracteres.
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Finalidade da categoria: "despesa", "receita" ou "ambas".
    /// Restringe o tipo de transação que pode usar esta categoria.
    /// </summary>
    public string Purpose { get; set; } = string.Empty;

    /// <summary>
    /// Navegação para as transações que utilizam esta categoria.
    /// </summary>
    public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
