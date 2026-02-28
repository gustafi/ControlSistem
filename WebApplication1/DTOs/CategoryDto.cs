namespace WebApplication1.DTOs;

/// <summary>
/// DTO usado para criação de categorias.
/// Não expõe campos de identificação gerados automaticamente pelo banco.
/// </summary>
public class CreateCategoryDto
{
    /// <summary>
    /// Descrição da categoria. Tamanho máximo: 400 caracteres.
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Finalidade da categoria: "despesa", "receita" ou "ambas".
    /// </summary>
    public string Purpose { get; set; } = string.Empty;
}

