namespace GestionPedidosAPI.Models;

//LA FUNCION DE PEDIDO.CS ES DESCRIBIR COMO ES UN PEDIDO
public class Dashboard{
    public int TotalPedidos {get;set;}
    public decimal VentasTotales {get; set;}
    public int Pendientes {get; set;}
    public int Completados {get; set;}

}