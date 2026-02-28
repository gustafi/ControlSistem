using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Configuração do banco de dados SQLite - dados persistem após reiniciar o sistema
// O arquivo expense_control.db será criado na pasta do aplicativo
builder.Services.AddDbContext<ExpenseControlDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")
        ?? "Data Source=expense_control.db"));

// CORS para permitir requisições do frontend React
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "http://localhost:5236", "https://localhost:44303")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Garante que o banco de dados seja criado/migrado na inicialização
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ExpenseControlDbContext>();
    db.Database.EnsureCreated();
}

// Configure the HTTP request pipeline - OpenAPI nativo + Swagger UI para documentação
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options => options.SwaggerEndpoint("/openapi/v1.json", "Controle de Gastos API v1"));
}

app.UseCors();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
