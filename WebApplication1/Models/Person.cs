namespace WebApplication1.Models;

/// <summary>
/// Representa uma pessoa cadastrada no sistema de controle de gastos residenciais.
/// Cada pessoa pode ter múltiplas transações associadas.
/// </summary>
public class Person
{
    /// <summary>
    /// Identificador único numérico gerado automaticamente para a pessoa.
    /// Este campo é a chave primária usada em relacionamentos e na API.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Nome da pessoa. Tamanho máximo: 200 caracteres.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Idade da pessoa. Usada para validar se menores de 18 anos
    /// podem registrar apenas despesas (não receitas).
    /// </summary>
    public int Age { get; set; }

    /// <summary>
    /// Navegação para as transações associadas a esta pessoa.
    /// Ao deletar uma pessoa, todas as transações são removidas em cascata.
    /// </summary>
    public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
