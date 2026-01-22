import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../models/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css']
})
export class ProductCard {
  @Input({ required: true }) product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() select = new EventEmitter<Product>(); 

  constructor(private router: Router) {}

  onAddToCart(event?: MouseEvent) {
    event?.stopPropagation();
    this.addToCart.emit(this.product);
  }

  onSelect() {
    this.select.emit(this.product);
    if (this.product && this.product.id !== undefined) {
      this.router.navigate(['/product', this.product.id]);
    }
  }

  onQuickView(event: MouseEvent) {
    event.stopPropagation();
    this.select.emit(this.product);
  }
}
