using GestionPedidosAPI.Data;
using Microsoft.EntityFrameworkCore;

//CONFIGURA ASP, EF Y POSTGRESQL

var builder = WebApplication.CreateBuilder(args);

var port = Environment.GetEnvironmentVariable("PORT") ?? "5081";
builder.WebHost.UseUrls($"http://*:{port}");

// Base de datos
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

// Controladores
builder.Services.AddControllers();
// Swagger/OpenAPI
builder.Services.AddOpenApi();


builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("ReactPolicy");

app.MapControllers();

app.Run();