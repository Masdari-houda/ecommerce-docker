import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCard } from '../product-card/product-card';
import { ProductService } from '../product-service';
import { Subscription } from 'rxjs';
import { ProductDetails } from '../product-details/product-details';
import { FilterService } from '../filter.service';
import { PanierService } from '../panier.service';
import { ActivatedRoute, Router } from '@angular/router';
import { auth } from '../../firebase-config';

@Component({
  selector: 'app-liste-products',
  standalone: true,
  imports: [CommonModule, ProductCard, ProductDetails],
  templateUrl: './liste-products.html'
})
export class ListeProducts implements OnInit, OnChanges, OnDestroy {
  @Input() searchQuery = '';
  @Input() selectedCategory = '';
  
  allProducts: any[] = [];
  products: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  selectedProduct: any = null;

  constructor(
    private productService: ProductService,
    private filterService: FilterService,
    private panierService: PanierService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  private filtersSub: Subscription | null = null;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const category = params['category'] || '';
      const search = params['search'] || '';
      const page = Number(params['page']) || 1;

      this.currentPage = page;

      if (this.filterService) {
        this.filterService.setCategory(category);
        this.filterService.setSearch(search);
      }
    });

    this.filtersSub = this.filterService.filters$.subscribe(f => {
      this.searchQuery = f.search;
      this.selectedCategory = f.category;
      this.filterProducts();
    });

    this.productService.getProducts().subscribe({
      next: (data) => {
        this.allProducts = data.products;
        this.filterProducts();
        this.isLoading = false;
        this.errorMessage = null;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.errorMessage = 'Impossible de charger les produits. Veuillez réessayer plus tard.';
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchQuery'] || changes['selectedCategory']) {
      this.filterProducts();
    }
  }

  currentPage = 1;
  itemsPerPage = 12;

  get paginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.products.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.products.length / this.itemsPerPage);
  }

  get pagesArray() {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  get visiblePages(): Array<number | string> {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2;

    if (total <= 7) return this.pagesArray;

    const pages: Array<number | string> = [];

    pages.push(1);

    const left = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);

    if (left > 2) {
      pages.push('...');
    } else {
      for (let i = 2; i < left; i++) pages.push(i);
    }

    for (let i = left; i <= right; i++) pages.push(i);

    if (right < total - 1) {
      pages.push('...');
    } else {
      for (let i = right + 1; i < total; i++) pages.push(i);
    }

    pages.push(total);

    return pages;
  }

  updateUrl() {
    this.router.navigate([], {
      queryParams: {
        page: this.currentPage,
        search: this.searchQuery,
        category: this.selectedCategory
      },
      queryParamsHandling: 'merge'
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  trackById(_: number, item: any) {
    return item?.id ?? item?.name ?? _;
  }

  setItemsPerPage(size: number | string) {
    const n = Number(size);
    if (!isNaN(n) && n > 0) {
      this.itemsPerPage = n;
      this.currentPage = 1;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  get endIndex() {
    return Math.min(this.currentPage * this.itemsPerPage, this.products.length);
  }

  private filterProducts() {
    this.products = this.filterService.filterProducts(this.allProducts, this.searchQuery, this.selectedCategory);
    this.currentPage = 1;
  }

  ngOnDestroy() {
    this.filtersSub?.unsubscribe();
  }

  message: string | null = null;
  private messageTimer: any = null;

  async onAddToCart(product: any) {
    const wasAuthenticated = !!auth.currentUser;
    await this.panierService.addProduct(product, 1);
    if (wasAuthenticated) {
      this.showMessage(`${product.name || product.title} ajouté au panier`);
    }
  }

  private showMessage(text: string) {
    this.message = text;
    if (this.messageTimer) clearTimeout(this.messageTimer);

    this.messageTimer = setTimeout(() => {
      this.message = null;
      this.messageTimer = null;
    }, 2500);
  }

  onProductSelected(product: any) {
    this.selectedProduct = product;
  }

  closeDetails() {
    this.selectedProduct = null;
  }
}
