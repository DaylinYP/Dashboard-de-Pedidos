
import './App.css'
import { useEffect, useState } from 'react';
import { Trash2, Pencil } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function App() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5081";
  //pedidos en dashboard
  const [dashboard, setDashboard] = useState<any>(null);
  const [pedidos, setPedidos] = useState<any[]>([]);

  //PDF
  const exportarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(17);
    doc.text("Reporte de Pedidos", 14, 15);
    doc.setFontSize(11);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`,
      14,
      22),

      autoTable(doc, {
        startY: 30,
        head: [["ID", "Cliente", "Producto", "Cantidad", "Precio", "Estado"]],
        body: pedidos.map((pedido) => [
          pedido.id,
          pedido.cliente,
          pedido.producto,
          pedido.cantidad,
          pedido.precio,
          pedido.estado
        ])
      });
    doc.save("Pedidos.pdf");
  }

  //FILTRO DE BUSQUEDA
  const [busqueda, setBusqueda] = useState("");

  //FILTRO POR ESTADO
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  //editar pedidos
  const [pedidoEditando, setPedidoEditando] = useState<any>(null);

  //mensaje de exito
  const [mensajeExito, setMensajeExito] = useState("");

  //crear 
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoPedido, setNuevoPedido] = useState({
    cliente: "",
    producto: "",
    precio: "",
    cantidad: "",
    estado: "Pendiente"

  });

  //cerrar formulario
  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setNuevoPedido({
      cliente: "",
      producto: "",
      precio: "",
      cantidad: "",
      estado: "Pendiente"
    });
  };



  const cargarDatos = async () => {
    const dashboardResponse = await fetch(
      `${API_URL}/api/dashboard`);


    const dashboardData = await dashboardResponse.json();
    setDashboard(dashboardData);

    const pedidosResponse = await fetch(
      `${API_URL}/api/pedidos`);

    const pedidosData = await pedidosResponse.json();
    setPedidos(pedidosData);

  };

  // ELIMINAR PEDIDO
  const eliminarPedido = async (id: number) => {

    if (!confirm("¿Deseas eliminar este pedido?")) {
      return;
    }
    await fetch(`${API_URL}/api/pedidos/${id}`,
      {
        method: "DELETE"
      }
    );

    await cargarDatos();
    setMensajeExito("Pedido eliminado correctamente");
    setTimeout(() => {
      setMensajeExito("");
    }, 3000);
  };

  // AGREGAR PEDIDO
  const agregarPedido = async () => {

    if (!nuevoPedido.cliente.trim()) {
      alert("Ingrese el nombre del cliente");
      return;
    }
    if (!nuevoPedido.producto.trim()) {
      alert("Ingrese el producto");
      return;
    }
    if (Number(nuevoPedido.precio) <= 0) {
      alert("El precio debe ser mayor a 0");
      return;
    }
    if (Number(nuevoPedido.cantidad) <= 0) {
      alert("La cantidad debe ser mayor a 0");
      return;
    }

    await fetch(`${API_URL}/api/pedidos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...nuevoPedido,
          precio: Number(nuevoPedido.precio),
          cantidad: Number(nuevoPedido.cantidad)
        })
      }
    );
    setNuevoPedido({
      cliente: "",
      producto: "",
      precio: "",
      cantidad: "",
      estado: "Pendiente"
    });

    setMostrarFormulario(false);
    await cargarDatos();

    setMensajeExito("Pedido agregado correctamente");
    setTimeout(() => {
      setMensajeExito("")
    }, 3000);
  }


  // EDITAR PEDIDOS
  const guardarCambios = async () => {
    await fetch(
      `http://localhost:5081/api/pedidos/${pedidoEditando.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(pedidoEditando)
      }
    );
    await cargarDatos();
    setPedidoEditando(null);
    setMensajeExito("Pedido actualizado correctamente");
    setTimeout(() => {
      setMensajeExito("");
    }, 3000);
  };



  useEffect(() => {
    cargarDatos();
  }, []);

  //FILTRO DE BUSQUEDA Y ESTADO

  const pedidosFiltrados = pedidos.filter((pedido) => {

    const coincideBusqueda =
      pedido.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      pedido.producto.toLowerCase().includes(busqueda.toLowerCase())

    const coincideEstado =
      filtroEstado === "Todos" || pedido.estado === filtroEstado;
    return coincideBusqueda && coincideEstado;
  }
  );

  //CREAR DATOS PARA GRAFICA
  const datosEstados = {
    labels: ["Pendientes", "Completados"],
    datasets: [

      {
        label: "Pedidos",
        data: [
          dashboard?.pendientes || 0,
          dashboard?.completados || 0
        ],
        backgroundColor: [
          "#f8df38",
          "#04de1e"
        ]
      },
    ],
  };

  return (
    <div>
      <div className='container'>
        <h1>Dashboard de Pedidos</h1>


        {dashboard && (
          <div className='cards'>

            <div className="card cardTotalPedidos">
              <h2>Total Pedidos</h2>
              <p>{dashboard.totalPedidos}</p>
            </div>

            <div className="card cardVentasTotales">
              <h2>Ventas Totales</h2>
              <p>Q {dashboard.ventasTotales}</p>
            </div>

            <div className="card cardPendiente">
              <h2>Pendiente</h2>
              <p>{dashboard.pendientes}</p>
            </div>
            <div className="card cardCompletado">
              <h2>Completados</h2>
              <p>{dashboard.completados}</p>
            </div>
          </div>
        )}

        <div className="grafica-container">
          <h2>Pedidos por Estado</h2>
          <div className="grafica-barra">

            <Bar
              data={datosEstados}
              options={
                {
                  responsive: true,
                  maintainAspectRatio: false
                }
              }
            ></Bar>

          </div>

        </div>



        <h3>Pedidos</h3>

        {/* MENSAJE DE EXITO DE EDITAR */}
        {mensajeExito && (
          <div className="alert-success">
            {mensajeExito}
          </div>
        )}


        <div className="filtros">
          <input type="text" className="input-busqueda" placeholder='Buscar cliente o producto...' value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          <select name="" id="" className="select-filtro" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="Todos">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Completado">Completado</option>

          </select>
        </div>
        <p>Mostrando {pedidosFiltrados.length} pedidos</p>


        {/* CREAR O AGREGAR PEDIDOS */}
        <div className="encabezado-pedidos">

          <button className="btn-pdf" onClick={exportarPDF}>Exportar PDF</button>

          <button className="btn-agregar" onClick={() => setMostrarFormulario(true)}>
            + Nuevo Pedido
          </button>
        </div>


        <div className='table-container'>

          <table >
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {pedidosFiltrados.map((pedido) => (

                <tr key={pedido.id}>
                  <td>
                    {pedido.id}
                  </td>
                  <td>
                    {pedido.cliente}
                  </td>
                  <td>
                    {pedido.producto}
                  </td>
                  <td>
                    {pedido.cantidad}
                  </td>
                  <td>
                    Q {pedido.precio}
                  </td>
                  <td>
                    <span className={`estado ${pedido.estado.toLowerCase()}`}>
                      {pedido.estado}
                    </span>
                  </td>
                  <td>
                    <div className="acciones">
                      <button className="btn-edit" onClick={() => setPedidoEditando(pedido)}>
                        <Pencil size={18} />
                      </button>

                      <button className="btn-delete" onClick={() => eliminarPedido(pedido.id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>

              ))}
            </tbody>
          </table>
        </div>
        {/* MODAL DE EDITAR */}
        {
          pedidoEditando && (
            <div className="modal" onClick={() => setPedidoEditando(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Editar Pedido</h2>
                <input className='clienteEditando' value={pedidoEditando.cliente} onChange={(e) => setPedidoEditando({
                  ...pedidoEditando,
                  cliente: e.target.value
                })} />

                <input className='productoEditando' value={pedidoEditando.producto}
                  onChange={(e) =>
                    setPedidoEditando({
                      ...pedidoEditando,
                      producto: e.target.value
                    })
                  }
                />
                <input className='productoEditando' value={pedidoEditando.precio}
                  onChange={(e) =>
                    setPedidoEditando({
                      ...pedidoEditando,
                      precio: e.target.value
                    })
                  }
                />
                <input className='productoEditando' value={pedidoEditando.cantidad}
                  onChange={(e) =>
                    setPedidoEditando({
                      ...pedidoEditando,
                      cantidad: e.target.value
                    })
                  }
                />
                <input className='productoEditando' value={pedidoEditando.estado}
                  onChange={(e) =>
                    setPedidoEditando({
                      ...pedidoEditando,
                      estado: e.target.value
                    })
                  }
                />
                <div className="accionesModal">
                  <button className='btn-guardar' onClick={guardarCambios}>Guardar</button>
                  <button className='btn-cancelar' onClick={() => setPedidoEditando(null)} >Cancelar</button>

                </div>
              </div>
            </div>
          )}

        {
          (mostrarFormulario && (

            <div className="modal" onClick={cerrarFormulario}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Nuevo Pedido</h2>
                <input placeholder='Cliente' value={nuevoPedido.cliente}
                  onChange={(e) =>
                    setNuevoPedido({
                      ...nuevoPedido,
                      cliente: e.target.value
                    })
                  } />
                <input placeholder='Producto' value={nuevoPedido.producto}
                  onChange={(e) =>
                    setNuevoPedido({
                      ...nuevoPedido,
                      producto: e.target.value
                    })
                  }
                />
                <input type='number' placeholder="Precio" value={nuevoPedido.precio}
                  onChange={(e) =>
                    setNuevoPedido({
                      ...nuevoPedido,
                      precio: (e.target.value)
                    })
                  }
                />
                <input type='number' placeholder='Cantidad' value={nuevoPedido.cantidad}
                  onChange={(e) =>
                    setNuevoPedido({
                      ...nuevoPedido,
                      cantidad: (e.target.value)
                    })
                  }
                />
                <select className='input-form' id="" value={nuevoPedido.estado}
                  onChange={(e) =>
                    setNuevoPedido({
                      ...nuevoPedido,
                      estado: e.target.value
                    })
                  }>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Completado">Completado</option>
                </select>

                <div className="accionesModal">
                  <button onClick={agregarPedido} className='btn-guardar'>
                    Guardar
                  </button>
                  <button className='btn-cancelar' onClick={cerrarFormulario}> Cancelar</button>

                </div>

              </div>

            </div>

          ))

        }

      </div>
      <footer>
        <h2>DESARROLLADO POR DAYLIN YOL © 2026</h2>
      </footer>

    </div>
  );
}

export default App;

