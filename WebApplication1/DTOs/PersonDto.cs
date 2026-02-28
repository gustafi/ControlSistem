namespace WebApplication1.DTOs;

/// <summary>
/// DTO usado para criação de pessoas.
/// Não expõe campos de identificação gerados automaticamente pelo banco.
/// </summary>
public class CreatePersonDto
{
    /// <summary>
    /// Nome da pessoa. Tamanho máximo: 200 caracteres.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Idade da pessoa.
    /// </summary>
    public int Age { get; set; }
}

/// <summary>
/// DTO usado para atualização de pessoas.
/// O identificador vem apenas na URL, não no corpo.
/// </summary>
public class UpdatePersonDto
{
    /// <summary>
    /// Nome da pessoa. Tamanho máximo: 200 caracteres.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Idade da pessoa.
    /// </summary>
    public int Age { get; set; }
}

