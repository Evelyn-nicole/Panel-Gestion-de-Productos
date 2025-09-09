// productos-lista: Muestra los productos.
// ts alberga la logica 

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../producto.model';

@Component({
  selector: 'app-productos-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos-lista.component.html',
  styleUrls: ['./productos-lista.component.css']
})
export class ProductosListaComponent {
  // Recibe la lista desde el padre (productos-page)
  @Input() productos: Producto[] = [];  // Este es el que permite usar [productos] en el HTML
  

  //  Emitirá el ID del producto que se quiere eliminar/editar
  @Output() editar = new EventEmitter<Producto>();
  @Output() onEliminarProducto = new EventEmitter<number>();
  @Input() ordenColumna: keyof Producto | '' = '';
  @Input() ordenAscendente: boolean = true;

  @Output() ordenar = new EventEmitter<keyof Producto>(); // nuevo evento

  // Esta función se ejecuta cuando se hace clic en el botón Eliminar
   eliminarProducto(id: number) {
    this.onEliminarProducto.emit(id);
  }

  // Esta función se ejecuta cuando se hace clic en el botón Editar
  seleccionarProducto(producto: Producto) {
    this.editar.emit(producto);
  }
}



