import { Routes } from '@angular/router';
import { ListeProducts } from './liste-products/liste-products';
import { Panier } from './panier/panier';
import { ProductDetails } from './product-details/product-details';
import { Commande } from './commande/commande';
import { auth } from '../firebase-config';
import { Auth } from './auth/auth';
import { Commandes } from './commandes/commandes';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'liste-products', pathMatch: 'full' },
  { path: 'auth', component: Auth },
  { path: 'liste-products', component: ListeProducts },
  { path: 'product/:id', component: ProductDetails },
  { path: 'panier', component: Panier, canActivate: [authGuard] },
  { path: 'commande', component: Commande, canActivate: [authGuard] },
  { path: 'commandes', component: Commandes, canActivate: [authGuard] },
  { path: '**', redirectTo: 'liste-products' }
];
