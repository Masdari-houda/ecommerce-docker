import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';

const API_URL = environment.apiUrl;


export interface BackendProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock?: number;
  thumbnail?: string;
  category?: string;
  brand?: string;
  images?: string[];
}

export interface BackendCartItem {
  id?: number;
  product: BackendProduct;
  quantity: number;
}

export interface BackendCart {
  id?: number;
  items: BackendCartItem[];
  total?: number;
  count?: number;
}

export interface BackendOrderItem {
  id?: number;
  product: BackendProduct;
  quantity: number;
  price: number;
}

export interface BackendOrder {
  id?: number;
  items: BackendOrderItem[];
  total: number;
  date?: string;
  statut?: 'EN_ATTENTE' | 'CONFIRMEE' | 'EXPEDIEE' | 'LIVREE' | 'ANNULEE';
  nom: string;
  prenom: string;
  adresse: string;
  ville: string;
  codePostal: string;
  telephone: string;
}

export interface BackendComment {
  id?: number;
  productId: number;
  userId?: string;
  userName: string;
  text: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  getProducts(): Observable<BackendProduct[]> {
    return this.http.get<BackendProduct[]>(`${API_URL}/products`);
  }

  getProductById(id: number): Observable<BackendProduct> {
    return this.http.get<BackendProduct>(`${API_URL}/products/${id}`);
  }

  getCart(userId: string): Observable<BackendCart> {
    return this.http.get<BackendCart>(`${API_URL}/cart?userId=${userId}`);
  }

  addToCart(userId: string, productId: number, quantity: number = 1, productInfo?: BackendProduct): Observable<BackendCart> {
    if (productInfo) {
      return this.http.post<BackendCart>(`${API_URL}/cart/items?quantity=${quantity}&userId=${userId}`, productInfo);
    } else {
      return this.http.post<BackendCart>(`${API_URL}/cart/items?productId=${productId}&quantity=${quantity}&userId=${userId}`, {});
    }
  }

  updateCartItem(userId: string, productId: number, quantity: number): Observable<BackendCart> {
    return this.http.put<BackendCart>(`${API_URL}/cart/items/${productId}?quantity=${quantity}&userId=${userId}`, {});
  }

  removeFromCart(userId: string, productId: number): Observable<BackendCart> {
    return this.http.delete<BackendCart>(`${API_URL}/cart/items/${productId}?userId=${userId}`);
  }

  clearCart(userId: string): Observable<void> {
    return this.http.post<void>(`${API_URL}/cart/clear?userId=${userId}`, {});
  }



  getOrderById(id: number): Observable<BackendOrder> {
    return this.http.get<BackendOrder>(`${API_URL}/orders/${id}`);
  }

  private cachedOrders: BackendOrder[] | null = null;

  getAllOrders(): Observable<BackendOrder[]> {
    if (this.cachedOrders) {
      return of(this.cachedOrders);
    }
    return this.http.get<BackendOrder[]>(`${API_URL}/orders`).pipe(
      tap(orders => this.cachedOrders = orders)
    );
  }

  createOrder(order: BackendOrder): Observable<BackendOrder> {
    return this.http.post<BackendOrder>(`${API_URL}/orders`, order).pipe(
      tap(newOrder => {
        if (this.cachedOrders) {
          this.cachedOrders = [newOrder, ...this.cachedOrders];
        }
      })
    );
  }

  getCommentsByProduct(productId: number): Observable<BackendComment[]> {
    return this.http.get<BackendComment[]>(`${API_URL}/comments/product/${productId}`);
  }

  createComment(comment: BackendComment): Observable<BackendComment> {
    return this.http.post<BackendComment>(`${API_URL}/comments`, comment);
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/comments/${id}`);
  }
}

