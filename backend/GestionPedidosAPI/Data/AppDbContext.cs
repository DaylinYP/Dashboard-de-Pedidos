using GestionPedidosAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace GestionPedidosAPI.Data;


//CONECTA LAS CLASES CON LA BASE DE DATOS

public class AppDbContext : DbContext
{


public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Pedido> Pedidos => Set<Pedido>();
}