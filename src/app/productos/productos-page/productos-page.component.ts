// productos-page: Une ambos y maneja la lógica
// compartida (la lista de productos).
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductosFormularioComponent } from '../productos-formulario/productos-formulario.component';
import { ProductosListaComponent } from '../productos-lista/productos-lista.component';
import { Producto, ProductoNuevo } from '../producto.model';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../productos.service'; // Servicio para comunicarse con el backend

declare var bootstrap: any; // Le decimos a TS que existe bootstrap

@Component({
  selector: 'app-productos-page', // Selector para usar este componente en templates
  standalone: true, // Componente autónomo (sin módulo tradicional)
  imports: [
    CommonModule, // Para directivas comunes como *ngIf, *ngFor
    FormsModule, // Para el manejo de formularios y ngModel
    ProductosFormularioComponent, // Componente hijo para formulario
    ProductosListaComponent, // Componente hijo para mostrar lista
  ],
  templateUrl: './productos-page.component.html', // HTML del componente
  styleUrls: ['./productos-page.component.css'], // Estilos CSS del componente
})
export class ProductosPageComponent implements OnInit {
  // Referencia al componente formulario hijo para acceder a sus métodos y propiedades
  @ViewChild(ProductosFormularioComponent)
  formularioComponent!: ProductosFormularioComponent;

  productos: Producto[] = []; // Array que almacena los productos traídos del backend
  productoParaEditar: Producto | null = null; // Producto seleccionado para editar, o null si no hay ninguno
  filtroNombre: string = ''; // Texto para filtrar productos por nombre
  mensajeExito: string = ''; // Mensaje temporal para mostrar éxito (agregar/editar)
  mensajeExitoGeneral: string = ''; // Mensaje para mostrar éxito de eliminar
  ordenActual: keyof Producto | '' = ''; // Indica por qué columna se está ordenando
  ordenAscendente: boolean = true; // Indica si el orden es ascendente o descendente

  // Inyecta el servicio para manejar datos (llamadas HTTP)
  constructor(private productosService: ProductosService) {}

  // Método que se ejecuta al iniciar el componente
  ngOnInit(): void {
    this.cargarProductos(); // Carga la lista de productos desde el backend
  }

  // Llama al servicio para obtener productos y los asigna al array local
  cargarProductos() {
    this.productosService.getProductos().subscribe({
      next: (data) => (this.productos = data), // Si todo bien, guardamos productos
      error: (err) => console.error('Error cargando productos', err), // Si hay error, lo mostramos
    });
  }

  // -------------------
  // Nuevas propiedades para filtros avanzados
  // -------------------
  precioMin: number | null = null; // Precio mínimo ingresado por el usuario
  precioMax: number | null = null; // Precio máximo ingresado por el usuario
  stockMin: number | null = null; // Stock mínimo ingresado por el usuario
  stockMax: number | null = null; // Stock máximo ingresado por el usuario

  // -------------------
  // Getter actualizado para productos filtrados
  // -------------------
  get productosFiltrados(): Producto[] {
    return this.productos
      .filter((p) =>
        // Filtro por nombre (ya existente)
        p.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
      )
      .filter((p) =>
        // Filtro por precio mínimo
        this.precioMin !== null ? (p.precio ?? 0) >= this.precioMin : true
      )
      .filter((p) =>
        // Filtro por precio máximo
        this.precioMax !== null ? (p.precio ?? 0) <= this.precioMax : true
      )
      .filter((p) =>
        // Filtro por stock mínimo
        this.stockMin !== null ? (p.stock ?? 0) >= this.stockMin : true
      )
      .filter((p) =>
        // Filtro por stock máximo
        this.stockMax !== null ? (p.stock ?? 0) <= this.stockMax : true
      );
  }

  // 📊 Cantidad total de productos
  get totalProductos(): number {
    return this.productos.length;
  }

  // 📊 Suma del stock de todos los productos (ignora nulos)
  get stockTotal(): number {
    return this.productos.reduce((acc, p) => acc + (p.stock ?? 0), 0);
  }

  // 📊 Número de productos con bajo stock (entre 1 y 5 unidades, por ejemplo)
  get productosBajoStock(): number {
    return this.productos.filter(
      (p) => p.stock !== null && p.stock > 0 && p.stock < 5
    ).length;
  }

  // Método para ordenar la lista según la columna clickeada
  ordenarPor(columna: keyof Producto) {
    if (this.ordenActual === columna) {
      // Si ya se ordena por esa columna, invertimos el orden (asc <-> desc)
      this.ordenAscendente = !this.ordenAscendente;
    } else {
      // Si es una nueva columna, la seteamos como columna actual y orden ascendente por defecto
      this.ordenActual = columna;
      this.ordenAscendente = true;
    }

    // Ordena el array productos según la columna y dirección establecidas
    this.productos.sort((a, b) => {
      const valorA = a[columna];
      const valorB = b[columna];

      // Normaliza valores para comparar strings en minúscula y números o valores nulos como 0
      const aVal =
        typeof valorA === 'string' ? valorA.toLowerCase() : valorA ?? 0;
      const bVal =
        typeof valorB === 'string' ? valorB.toLowerCase() : valorB ?? 0;

      // Compara y devuelve 1, -1 o 0 según orden ascendente o descendente
      return this.ordenAscendente
        ? aVal > bVal
          ? 1
          : aVal < bVal
          ? -1
          : 0
        : aVal < bVal
        ? 1
        : aVal > bVal
        ? -1
        : 0;
    });
  }


  // Método que elimina un producto por id con confirmación
  eliminarProducto(id: number) {
    // NO preguntar con confirm(), ya lo hace el modal
    this.productosService.eliminarProducto(id).subscribe({
      next: () => {
        this.productos = this.productos.filter((p) => p.id !== id);
        this.mensajeExitoGeneral = '¡Producto eliminado correctamente!';
        setTimeout(() => (this.mensajeExitoGeneral = ''), 3000);
      },
      error: (err) => console.error('Error eliminando producto', err),
    });
  }

  // Producto que vamos a eliminar desde el modal
  productoAEliminar: Producto | null = null;

  // Muestra el modal y guarda el producto a eliminar
  mostrarConfirmDelete(producto: Producto) {
    this.productoAEliminar = producto;
    const modal = new bootstrap.Modal(
      document.getElementById('confirmDeleteModal')!
    );
    modal.show();
  }

  // Llama a tu función existente para eliminar
  confirmarEliminar() {
    if (!this.productoAEliminar) return;

    this.eliminarProducto(this.productoAEliminar.id);

    // Cerramos el modal
    const modalEl = document.getElementById('confirmDeleteModal')!;
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal?.hide();

    this.productoAEliminar = null;
  }

  agregarProducto(productoNuevo: Producto) {
    // Creamos una copia del producto, excluyendo el id
    const { id, ...productoSinId } = productoNuevo;

    this.productosService.crearProducto(productoSinId).subscribe({
      next: (productoGuardado: Producto) => {
        this.productos.push(productoGuardado);
        this.mensajeExito = '¡Producto agregado correctamente!';

        setTimeout(() => (this.mensajeExito = ''), 3000);
      },
      error: (err) => console.error('Error agregando producto', err),
    });
  }

  // Selecciona un producto para enviar a edición (se hace copia para no mutar original)
  seleccionarProductoParaEditar(producto: Producto) {
    this.productoParaEditar = { ...producto };
  }

  editarProducto(productoEditado: Producto) {
    const { id, ...productoSinId } = productoEditado; // ⛔ quitamos el id del body

    this.productosService
      .editarProducto(productoEditado.id, productoSinId)
      .subscribe({
        next: (actualizado: Producto) => {
          const index = this.productos.findIndex(
            (p) => p.id === productoEditado.id
          );
          if (index !== -1) this.productos[index] = actualizado;
          this.mensajeExito = '¡Producto editado correctamente!';
          setTimeout(() => (this.mensajeExito = ''), 3000);
          this.productoParaEditar = null;
        },
        error: (err) => console.error('Error editando producto', err),
      });
  }
}
