using GestionPedidosAPI.Data;
using GestionPedidosAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GestionPedidosAPI.Controllers;

//RECIBE PETICIONES HTTP Y USA EF PARA LEER O ESCRIBIR DATOS

[Route("api/[controller]")]
[ApiController]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;
    public DashboardController(AppDbContext context)
    {
        _context = context;
    }

    //Obtener todos los pedidos
    [HttpGet]
    public async Task<ActionResult<Dashboard>> ObtenerDashboard()
    {
        var dashboard = new Dashboard
        {
            TotalPedidos = await _context.Pedidos.CountAsync(),
            VentasTotales = await _context.Pedidos.SumAsync(p => p.Precio * p.Cantidad), //SumAsync suma los valores es como SELECT SUM(Precio*Cantidad) FROM "Pedidos";            
            Pendientes = await _context.Pedidos.CountAsync(p => p.Estado == "Pendiente"), //countasync cuenta los registos, es como un SELECT COUNT(*) FROM "Pedidos";
            Completados = await _context.Pedidos.CountAsync(p => p.Estado == "Completado"),

        };
        return dashboard;
    }


   
}
