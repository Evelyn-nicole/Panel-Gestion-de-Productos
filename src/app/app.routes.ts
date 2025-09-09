import { Routes } from '@angular/router';
import { ProductosPageComponent } from './productos/productos-page/productos-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'productos',
    pathMatch: 'full'
  },
  {
    path: 'productos',
    component: ProductosPageComponent
  }
];

