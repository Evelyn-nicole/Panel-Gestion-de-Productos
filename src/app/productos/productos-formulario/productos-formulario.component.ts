// // productos-formulario: Agrega productos.
// // ts alberga la logica 

// import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
// import { CommonModule } from '@angular/common'; // Para usar *ngIf y otras directivas
// import { FormsModule } from '@angular/forms'; // Para usar ngModel (formulario)
// import { Producto } from '../producto.model'; // Interfaz del producto
// import { NgForm } from '@angular/forms';

// @Component({
//   selector: 'app-productos-formulario',
//   standalone: true, // Es un componente independiente, no depende de un módulo tradicional
//   imports: [CommonModule, FormsModule], // Importa lo necesario para usar *ngIf y ngModel
//   templateUrl: './productos-formulario.component.html',
//   styleUrls: ['./productos-formulario.component.css']
// })
// export class ProductosFormularioComponent {
//   @Output() onAgregarProducto = new EventEmitter<Producto>(); // Emitimos el producto al componente padre
//   @Output() onEditarProducto = new EventEmitter<Producto>();
//   @Input() productoParaEditar: Producto | null = null;


//   nuevoProducto: Producto = {
//     id: 0,
//     nombre: '',
//     precio: null,
//     stock: null,
//   };

//   mensajeExito: string = '';
//   mensajeError: string = '';


//   // Se activa si cambia el productoParaEditar
//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes['productoParaEditar'] && this.productoParaEditar) {
//       // Copiamos los datos para que el formulario los muestre
//       this.nuevoProducto = { ...this.productoParaEditar };
//       this.mensajeExito = '';
//       this.mensajeError = '';
//     }
//   }

//   // 1. Guardar (crear o editar)
//   agregarProducto(formulario: NgForm) {
//     // Validación de campos
//     if (
//       !this.nuevoProducto.nombre ||
//       this.nuevoProducto.precio === null || this.nuevoProducto.precio < 1 ||
//       this.nuevoProducto.stock === null || this.nuevoProducto.stock < 0
//     ) {
//       this.mensajeError = 'Revisa los campos. No se permiten valores vacíos ni negativos.';
//       this.mensajeExito = '';
//       return;
//     }

//     if (this.productoParaEditar) {
//       const productoEditado = { ...this.nuevoProducto };
//       this.onEditarProducto.emit(productoEditado);
//       this.mensajeExito = '¡Producto editado correctamente!';
//     } else {
//       this.onAgregarProducto.emit({ ...this.nuevoProducto });
//       this.mensajeExito = '¡Producto agregado correctamente!';
//     }

   
//     this.mensajeError = '';

//     formulario.resetForm();

//     this.nuevoProducto = {
//       id: 0,
//       nombre: '',
//       precio: null,
//       stock: null,
//     };

//     this.productoParaEditar = null; // Salimos del modo edición
//   }

//    limpiarMensajes() {
//       this.mensajeExito = '';
//       this.mensajeError = '';
//     }


//   // 2. Cancelar edición
//   cancelarEdicion() {
//     this.productoParaEditar = null; // salir del modo edición

//     this.nuevoProducto = {
//       id: 0,
//       nombre: '',
//       precio: null,
//       stock: null,
//     };

//     this.mensajeError = '';
//     this.mensajeExito = '';
//   }
// }


// productos-formulario: Agrega productos.
// ts alberga la logica 

import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para usar *ngIf y otras directivas
import { FormsModule } from '@angular/forms'; // Para usar ngModel (formulario)
import { Producto } from '../producto.model'; // Interfaz del producto
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-productos-formulario',
  standalone: true, // Es un componente independiente
  imports: [CommonModule, FormsModule], // Para usar *ngIf y ngModel
  templateUrl: './productos-formulario.component.html',
  styleUrls: ['./productos-formulario.component.css']
})
export class ProductosFormularioComponent implements OnChanges {
  // Emitimos el producto al componente padre
  @Output() onAgregarProducto = new EventEmitter<Producto>();
  @Output() onEditarProducto = new EventEmitter<Producto>();
  @Input() productoParaEditar: Producto | null = null;

  // Modelo que usamos en el formulario
  nuevoProducto: Producto = {
    id: 0,
    nombre: '',
    precio: null,
    stock: null,
  };

  // Mensajes para mostrar en pantalla
  mensajeError: string = '';
  mensajeExito: string = ''; 

  // Si cambia el producto para editar, lo cargamos al formulario
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productoParaEditar'] && this.productoParaEditar) {
      this.nuevoProducto = { ...this.productoParaEditar };
      this.mensajeError = '';
      this.mensajeExito = '';
    }
  }

  // Guardar producto (agregar o actualizar)
  agregarProducto(formulario: NgForm) {
    // Validación básica
    if (
      !this.nuevoProducto.nombre ||
      this.nuevoProducto.precio === null || this.nuevoProducto.precio < 1 ||
      this.nuevoProducto.stock === null || this.nuevoProducto.stock < 0
    ) {
      this.mensajeError = 'Revisa los campos. No se permiten valores vacíos ni negativos.';
      this.mensajeExito = '';
      return;
    }

    // Si estás editando, emitimos el evento de edición
    if (this.productoParaEditar) {
      this.onEditarProducto.emit({ ...this.nuevoProducto });
      // this.mensajeExito = 'Producto actualizado con éxito.'; // se repite este pto mensaje al eliminar
    } else {
      this.onAgregarProducto.emit({ ...this.nuevoProducto }); 
      // this.mensajeExito = 'Producto agregado con éxito.';
    }

    // Limpiar estado
    this.mensajeError = '';
    formulario.resetForm();
    this.nuevoProducto = {
      id: 0,
      nombre: '',
      precio: null,
      stock: null,
    };
    this.productoParaEditar = null;
  }

  // Salir del modo edición
  cancelarEdicion() {
    this.productoParaEditar = null;
    this.mensajeError = '';
    this.mensajeExito = '';

    this.nuevoProducto = {
      id: 0,
      nombre: '',
      precio: null,
      stock: null,
    };
  }
}
