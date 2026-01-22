import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://dummyjson.com/products';
  private cachedData: any = null;
  private cachedProducts = new Map<number, any>();

  constructor(private http: HttpClient) { }

  getProducts() {
    if (this.cachedData) {
      return of(this.cachedData);
    }
    return this.http.get<any>(`${this.apiUrl}?limit=100`).pipe(
      tap(data => {
        this.cachedData = data;
        if (data && Array.isArray(data.products)) {
          data.products.forEach((p: any) => this.cachedProducts.set(p.id, p));
        }
      })
    );
  }

  getProductById(id: number): Observable<any> {
    if (this.cachedProducts.has(id)) {
      return of(this.cachedProducts.get(id));
    }

    if (this.cachedData && Array.isArray(this.cachedData.products)) {
      const found = this.cachedData.products.find((p: any) => p.id === id);
      if (found) {
        this.cachedProducts.set(id, found);
        return of(found);
      }
    }

    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      tap(p => this.cachedProducts.set(id, p))
    );
  }
}