namespace WebApplication1.DTOs
{
    public class PersonResponseDto
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
    }
}