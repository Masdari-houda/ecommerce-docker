import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBar } from '../search-bar/search-bar';
import { Auth } from '../auth/auth';
import { Panier } from '../panier/panier';
import { RouterModule } from '@angular/router';
import { FilterService } from '../filter.service';
import { PanierService } from '../panier.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, SearchBar, Auth, Panier, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit, OnDestroy {
  cartCount = 0;
  private sub: Subscription | null = null;

  constructor(private filterService: FilterService, private panierService: PanierService) { }

  @Output() globalSearch = new EventEmitter<string>();

  ngOnInit() {
    this.sub = this.panierService.cart$.subscribe(c => this.cartCount = c.reduce((s, p) => s + p.quantity, 0));
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  onGlobalSearch(query: string) {
    this.globalSearch.emit(query);
    this.filterService.setSearch(query || '');
  }
}