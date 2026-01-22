import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FilterService {
  private searchQuery$ = new BehaviorSubject<string>('');
  private selectedCategory$ = new BehaviorSubject<string>('');

  setSearch(query: string) {
    this.searchQuery$.next(query || '');
  }

  setCategory(category: string) {
    this.selectedCategory$.next(category || '');
  }

  get search$() {
    return this.searchQuery$.asObservable();
  }

  get category$() {
    return this.selectedCategory$.asObservable();
  }

  get filters$() {
    return combineLatest([this.search$, this.category$]).pipe(
      map(([search, category]) => ({ search, category }))
    );
  }

  // Pure helper function to filter an array of products
  filterProducts(products: any[], search: string, category: string) {
    let filtered = Array.isArray(products) ? products.slice() : [];
    const q = (search || '').trim().toLowerCase();

    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    if (q) {
      filtered = filtered.filter(p =>
        (p.title || p.name || '').toLowerCase().includes(q) ||
        (p.brand || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      );
    }

    return filtered;
  }
}
