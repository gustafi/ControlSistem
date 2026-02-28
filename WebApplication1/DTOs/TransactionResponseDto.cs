namespace WebApplication1.DTOs
{
    public class TransactionResponseDto
    {
        public int Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Value { get; set; }
        public string Type { get; set; } = string.Empty;
        public int PersonId { get; set; }
        public CategoryResponseDto Category { get; set; } = null!;
        public PersonResponseDto Person { get; set; } = null!;
    }
}
