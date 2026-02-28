namespace WebApplication1.Models;

/// <summary>
/// Representa uma transação financeira (despesa ou receita) no sistema.
/// Cada transação está vinculada a uma pessoa e uma categoria.
/// Menores de 18 anos só podem registrar despesas.
/// </summary>
public class Transaction
{
    /// <summary>
    /// Identificador único numérico gerado automaticamente para a transação.
    /// Este campo é a chave primária usada em relacionamentos e na API.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Descrição da transação. Tamanho máximo: 400 caracteres.
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Valor da transação. Deve ser sempre positivo.
    /// </summary>
    public decimal Value { get; set; }

    /// <summary>
    /// Tipo da transação: "despesa" ou "receita".
    /// Deve ser compatível com a finalidade da categoria escolhida.
    /// </summary>
    public string Type { get; set; } = string.Empty;

    /// <summary>
    /// Identificador da categoria associada à transação.
    /// A categoria deve ter finalidade compatível com o tipo (despesa/receita).
    /// </summary>
    public int CategoryId { get; set; }
    public virtual Category Category { get; set; } = null!;

    /// <summary>
    /// Identificador da pessoa associada à transação.
    /// </summary>
    public int PersonId { get; set; }
    public virtual Person Person { get; set; } = null!;
}
