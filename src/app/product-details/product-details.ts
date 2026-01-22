import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../models/product';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product-service';
import { PanierService } from '../panier.service';
import { ApiService, BackendComment } from '../services/api.service';
import { FormsModule } from '@angular/forms'; 
import { auth } from '../../firebase-config';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css']
})
export class ProductDetails implements OnInit, OnDestroy {
  @Input() product!: Product | any;
  @Output() close = new EventEmitter<void>();
  @Output() add = new EventEmitter<any>();

  isRouteView = false;
  comments: BackendComment[] = [];
  newComment: string = '';
  private commentRefreshInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private panierService: PanierService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isRouteView = true;
      const id = Number(idParam);
      this.productService.getProductById(id).subscribe({
        next: (data) => {
          this.product = data;
          this.loadComments(id);
          // Rafraîchir les commentaires toutes les 5 secondes
          this.commentRefreshInterval = setInterval(() => {
            this.loadComments(id);
          }, 5000);
        },
        error: (err) => console.error(err)
      });
    } else if (this.product) {
      this.loadComments(this.product.id);
      // Rafraîchir les commentaires toutes les 5 secondes
      this.commentRefreshInterval = setInterval(() => {
        this.loadComments(this.product.id);
      }, 5000);
    }
  }

  async loadComments(productId: number) {
    try {
      this.comments = await firstValueFrom(this.apiService.getCommentsByProduct(productId));
    } catch (err) {
      console.error('Erreur lors du chargement des commentaires:', err);
      this.comments = [];
    }
  }

  async postComment() {
    const user = auth.currentUser;
    if (!user) {
      alert("Connectez-vous pour laisser un commentaire");
      return;
    }
    if (!this.newComment.trim()) return;

    try {
      const comment: BackendComment = {
        productId: this.product.id,
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'Anonyme',
        text: this.newComment
      };
      
      await firstValueFrom(this.apiService.createComment(comment));
      this.newComment = '';
      // Recharger les commentaires
      await this.loadComments(this.product.id);
    } catch (e) {
      console.error("Erreur commentaire:", e);
      alert("Erreur lors de l'ajout du commentaire");
    }
  }

  ngOnDestroy() {
    if (this.commentRefreshInterval) {
      clearInterval(this.commentRefreshInterval);
    }
  }

  // ... Vos méthodes existantes (onClose, onAddToCart, goBack, etc.) ...
  onClose() { this.close.emit(); }
  
  message: string | null = null;
  private messageTimer: any = null;

  async onAddToCart() {
    if (this.isRouteView) {
      await this.panierService.addProduct(this.product, 1);
      this.showMessage(`${this.product.name || this.product.title} ajouté au panier`);
    } else {
      this.add.emit(this.product);
    }
  }

  private showMessage(text: string) {
    this.message = text;
    if (this.messageTimer) clearTimeout(this.messageTimer);
    this.messageTimer = setTimeout(() => this.message = null, 2500);
  }

  goBack() { this.router.navigate(['/liste-products']); }

  formatDate(dateString?: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('fr-FR', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return dateString;
    }
  }
}