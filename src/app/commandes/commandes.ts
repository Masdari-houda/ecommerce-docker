import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, BackendOrder } from '../services/api.service';

@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './commandes.html',
  styleUrls: ['./commandes.css']
})
export class Commandes implements OnInit {

  commandes: BackendOrder[] = [];
  loading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.chargerCommandes();
  }

  chargerCommandes() {
    this.apiService.getAllOrders().subscribe({
      next: (data) => {
        this.commandes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement commandes', err);
        this.loading = false;
        alert("Impossible de charger vos commandes !");
      }
    });
  }
}
