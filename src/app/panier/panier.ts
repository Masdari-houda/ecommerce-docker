import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../models/product';
import { PanierProduit } from '../models/panier-produit';
import { PanierService } from '../panier.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panier.html',
  styleUrls: ['./panier.css']
})
export class Panier implements OnInit, OnDestroy {
 
  panier: PanierProduit[] = [];
  private sub: Subscription | null = null;

  constructor(
    private panierService: PanierService,
    private router: Router
  ) {}

  ngOnInit() {
    this.sub = this.panierService.cart$.subscribe(c => this.panier = c);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  getTotal(p: PanierProduit) {
    return p.price * p.quantity;
  }

  getTotalPanier() {
    return this.panier.reduce((sum, p) => sum + p.price * p.quantity, 0);
  }

  async removeProduct(productId: number) {
    await this.panierService.removeProductById(productId);
  }

  async updateQuantity(productId: number, quantity: number) {
    await this.panierService.updateQuantity(productId, quantity);
  }

  validerCommande() {
    if (this.panier.length === 0) {
      alert('Votre panier est vide');
      return;
    }
    this.router.navigate(['/commande']);
  }
}