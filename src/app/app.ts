import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from './header/header';
import { Categories } from './categories/categories';
import { ListeProducts } from './liste-products/liste-products';
import { Footer } from './footer/footer';
import { RouterModule, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, Header, Categories, ListeProducts, Footer, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  searchQuery = '';
  selectedCategory = '';
  showLayout = true;

  constructor(private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {

        this.showLayout = !event.url.includes('auth') && event.url !== '/';
      }
    });
  }

  onSearch(query: string) {
    this.searchQuery = query.trim();
  }

  onCategorySelected(category: string) {
    this.selectedCategory = category;
  }

}