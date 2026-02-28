namespace WebApplication1.DTOs;

/// <summary>
/// DTO usado para criação de transações.
/// Não expõe campos de identificação gerados automaticamente pelo banco.
/// </summary>
public class CreateTransactionDto
{
    /// <summary>
    /// Descrição da transação. Tamanho máximo: 400 caracteres.
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Valor positivo da transação.
    /// </summary>
    public decimal Value { get; set; }

    /// <summary>
    /// Tipo da transação: "despesa" ou "receita".
    /// </summary>
    public string Type { get; set; } = string.Empty;

    /// <summary>
    /// Identificador da categoria associada à transação.
    /// </summary>
    public int CategoryId { get; set; }

    /// <summary>
    /// Identificador da pessoa associada à transação.
    /// </summary>
    public int PersonId { get; set; }
}

