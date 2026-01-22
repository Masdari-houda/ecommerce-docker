import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { PanierProduit } from './models/panier-produit';
import { Product } from './models/product';
import { ApiService, BackendCart, BackendCartItem } from './services/api.service';
import { auth } from '../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class PanierService {
  private cartSubject = new BehaviorSubject<PanierProduit[]>([]);
  cart$ = this.cartSubject.asObservable();
  private currentUserId: string | null = null;

  constructor(private apiService: ApiService) {

    onAuthStateChanged(auth, (user) => {
      this.currentUserId = user?.uid || null;
      if (this.currentUserId) {
        this.loadCartFromBackend();
      } else {
        this.cartSubject.next([]);
      }
    });
  }

  private getUserId(): string {
    if (!this.currentUserId) {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }
      return user.uid;
    }
    return this.currentUserId;
  }

  private async loadCartFromBackend() {
    try {
      const userId = this.getUserId();
      const backendCart = await firstValueFrom(this.apiService.getCart(userId));
      const cart: PanierProduit[] = this.convertBackendCartToPanier(backendCart);
      this.cartSubject.next(cart);
    } catch (err) {
      console.error('Erreur lors du chargement du panier:', err);
      this.cartSubject.next([]);
    }
  }

  private convertBackendCartToPanier(backendCart: BackendCart): PanierProduit[] {
    if (!backendCart.items || backendCart.items.length === 0) {
      return [];
    }
    return backendCart.items.map(item => ({
      produit: this.convertBackendProductToProduct(item.product),
      quantity: item.quantity,
      price: item.product.price
    }));
  }

  private convertBackendProductToProduct(backendProduct: any): Product {
    return {
      id: backendProduct.id,
      name: backendProduct.name || '',
      title: backendProduct.name || '',
      description: backendProduct.description || '',
      price: backendProduct.price,
      category: '',
      stock: 0,
      thumbnail: '',
      img: ''
    };
  }

  getCartSnapshot(): PanierProduit[] {
    return this.cartSubject.getValue();
  }

  async addProduct(produit: Product, quantity: number = 1): Promise<void> {
    try {
      const userId = this.getUserId();
      const productInfo = {
        id: produit.id,
        name: produit.name || produit.title || 'Produit sans nom',
        description: produit.description || '',
        price: produit.price
      };
      
      const backendCart = await firstValueFrom(
        this.apiService.addToCart(userId, produit.id, quantity, productInfo)
      );
      const cart = this.convertBackendCartToPanier(backendCart);
      this.cartSubject.next(cart);
    } catch (err: any) {
      console.error('Erreur lors de l\'ajout au panier:', err);
      const errorMessage = err?.error?.message || err?.message || 'Erreur inconnue';
      console.error('Détails de l\'erreur:', errorMessage);
      if (errorMessage.includes('non connecté')) {
        alert('Vous devez être connecté pour ajouter des produits au panier');
      } else {
        alert(`Erreur lors de l'ajout au panier: ${errorMessage}. Vérifiez que le backend est démarré sur http://localhost:8080`);
      }
    }
  }

  async removeProductById(productId: number): Promise<void> {
    try {
      const userId = this.getUserId();
      const backendCart = await firstValueFrom(
        this.apiService.removeFromCart(userId, productId)
      );
      const cart = this.convertBackendCartToPanier(backendCart);
      this.cartSubject.next(cart);
    } catch (err) {
      console.error('Erreur lors de la suppression du produit:', err);
    }
  }

  async updateQuantity(productId: number, quantity: number): Promise<void> {
    if (quantity <= 0) {
      await this.removeProductById(productId);
      return;
    }

    try {
      const userId = this.getUserId();
      const backendCart = await firstValueFrom(
        this.apiService.updateCartItem(userId, productId, quantity)
      );
      const cart = this.convertBackendCartToPanier(backendCart);
      this.cartSubject.next(cart);
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la quantité:', err);
    }
  }

  async clearCart(): Promise<void> {
    try {
      const userId = this.getUserId();
      await firstValueFrom(this.apiService.clearCart(userId));
      this.cartSubject.next([]);
    } catch (err) {
      console.error('Erreur lors du vidage du panier:', err);
    }
  }

  getTotal(): number {
    return this.getCartSnapshot().reduce((sum, p) => sum + p.price * p.quantity, 0);
  }

  getCount(): number {
    return this.getCartSnapshot().reduce((sum, p) => sum + p.quantity, 0);
  }
}