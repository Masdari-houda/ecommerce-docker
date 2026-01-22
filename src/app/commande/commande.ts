import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PanierProduit } from '../models/panier-produit';
import { PanierService } from '../panier.service';
import { ApiService, BackendOrder, BackendOrderItem } from '../services/api.service';

@Component({
  selector: 'app-commande',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commande.html',
  styleUrls: ['./commande.css']
})
export class Commande implements OnInit {
  produits: PanierProduit[] = [];
  total: number = 0;
  
  adresseLivraison = {
    nom: '',
    prenom: '',
    adresse: '',
    ville: '',
    codePostal: '',
    telephone: ''
  };

  constructor(
    private router: Router,
    private panierService: PanierService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    // Récupérer les données du panier depuis le service
    this.produits = this.panierService.getCartSnapshot();
    this.total = this.panierService.getTotal();
    
    if (this.produits.length === 0) {
      // Si le panier est vide, rediriger vers le panier
      this.router.navigate(['/panier']);
    }
  }

  getTotalProduit(p: PanierProduit): number {
    return p.price * p.quantity;
  }

  async validerCommande() {
  
    if (!this.adresseLivraison.nom || !this.adresseLivraison.prenom || 
        !this.adresseLivraison.adresse || !this.adresseLivraison.ville || 
        !this.adresseLivraison.codePostal || !this.adresseLivraison.telephone) {
      alert('Veuillez remplir tous les champs d\'adresse de livraison');
      return;
    }

    try {
      const orderItems: BackendOrderItem[] = this.produits.map(p => ({
        product: {
          id: p.produit.id,
          name: p.produit.name || p.produit.title,
          description: p.produit.description,
          price: p.price
        },
        quantity: p.quantity,
        price: p.price
      }));

      const nouvelleCommande: BackendOrder = {
        items: orderItems,
        total: this.total,
        statut: 'EN_ATTENTE',
        nom: this.adresseLivraison.nom,
        prenom: this.adresseLivraison.prenom,
        adresse: this.adresseLivraison.adresse,
        ville: this.adresseLivraison.ville,
        codePostal: this.adresseLivraison.codePostal,
        telephone: this.adresseLivraison.telephone
      };

     
      const savedOrder = await firstValueFrom(this.apiService.createOrder(nouvelleCommande));
      
    
      await this.panierService.clearCart();
      
  
      alert(`Commande validée avec succès ! Numéro de commande: ${savedOrder?.id}`);
      this.router.navigate(['/commandes']);
    } catch (error) {
      console.error('Erreur lors de la validation de la commande:', error);
      alert('Une erreur est survenue lors de la validation de la commande');
    }
  }

  retourPanier() {
    this.router.navigate(['/panier']);
  }
}

