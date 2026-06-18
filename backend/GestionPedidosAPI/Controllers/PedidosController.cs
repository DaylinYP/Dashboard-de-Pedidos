using GestionPedidosAPI.Data;
using GestionPedidosAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GestionPedidosAPI.Controllers;

//RECIBE PETICIONES HTTP Y USA EF PARA LEER O ESCRIBIR DATOS

[Route("api/[controller]")]
[ApiController]
public class PedidosController : ControllerBase
{
    private readonly AppDbContext _context;
    public PedidosController(AppDbContext context)
    {
        _context = context;
    }

    //Obtener todos los pedidos
    [HttpGet]
                        //IEnumerable significa lista de pedidos
    public async Task<ActionResult<IEnumerable<Pedido>>> GetPedidos()
    {
        return await _context.Pedidos.ToListAsync(); //Es como SELECT * FROM
    }

    //Obtener un pedido en especifico

    [HttpGet("{id}")]
    public async Task<ActionResult<Pedido>> GetPedido(int id)
    {
        var pedido = await _context.Pedidos.FindAsync(id); //ES COMO SELECT * FROM "Pedidos" WHERE "Id" = 1

        if (pedido == null) //Si no existe genera un 404 not found
            return NotFound();
        return pedido; //Si existe regresa lo que se le pidio
    }

    //Crear un pedido
    [HttpPost]
    public async Task<ActionResult<Pedido>> CrearPedido(Pedido pedido)
    {
        _context.Pedidos.Add(pedido);
        await _context.SaveChangesAsync();
        return CreatedAtAction(

            nameof(GetPedido),
            new { id = pedido.Id },
            pedido
        );
    }

    //Actualizar un pedido
    [HttpPut("{id}")]
    public async Task<IActionResult> ActualizarPedido(int id, Pedido pedidoActualizado)
    {
        var pedido = await _context.Pedidos.FindAsync(id);

        if (pedido == null)
        {
            return NotFound();
        }

        // La parte de aca copia el valor nuevo
        pedido.Cliente = pedidoActualizado.Cliente;
        pedido.Producto = pedidoActualizado.Producto;
        pedido.Precio = pedidoActualizado.Precio;
        pedido.Cantidad = pedidoActualizado.Cantidad;
        pedido.Estado = pedidoActualizado.Estado;


        //Guarda, es como UPDATE "Pedidos" SET "Cliente" = "Matias" Where "Id" = 1
        await _context.SaveChangesAsync();

        return NoContent();

    }


    
    [HttpDelete("{id}")]
    public async Task<ActionResult> EliminarPedido(int id)
    {
        //Buscar
        var pedido = await _context.Pedidos.FindAsync(id);
        if(pedido == null)
        {
            return NotFound();
        }

        //Eliminar
        _context.Pedidos.Remove(pedido);
        //GENERA COMO DELETE FROM "Pedidos" WHERE "Id" = 1
        await _context.SaveChangesAsync();
        return NoContent();
    }

}
