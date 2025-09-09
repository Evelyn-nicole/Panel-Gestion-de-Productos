export interface Producto {
  id: number;
  nombre: string;
  precio: number | null;
  stock: number | null;
}

// Nuevo tipo solo para crear productos (sin id)
export type ProductoNuevo = Omit<Producto, 'id'>;

