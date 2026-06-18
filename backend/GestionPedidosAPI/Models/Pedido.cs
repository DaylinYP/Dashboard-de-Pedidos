namespace GestionPedidosAPI.Models;
// //CONTIENE UNA MIGRACION
// Pedido.cs > dotnet ef migrations add > Migra > dotnet ef database update > PostgreSQL actualiza


//LA FUNCION DE PEDIDO.CS ES DESCRIBIR COMO ES UN PEDIDO
public class Pedido{
    public int Id {get;set;}
    public string Cliente {get;set;} = string.Empty;
    public string Producto {get;set;} = string.Empty;
    public decimal Precio {get;set;}
    public int Cantidad {get;set;}
    public string Estado {get;set;} = "Pendiente";
    public DateTime Fecha { get; set; } = DateTime.UtcNow;


}