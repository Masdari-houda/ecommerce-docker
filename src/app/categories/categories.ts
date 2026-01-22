import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../product-service';
import { FilterService } from '../filter.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css']
})
export class Categories implements OnInit {
  categories: string[] = [];
  @Input() selectedCategory = '';
  @Output() categorySelected = new EventEmitter<string>();

  constructor(
    private productService: ProductService,
    private filterService: FilterService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        const uniqueCategories = [...new Set(data.products
          .map((p: any) => p.category)
          .filter((cat: any) => cat)
        )] as string[];

        this.categories = uniqueCategories.sort((a, b) => a.localeCompare(b));
      }
    });

    this.route.queryParams.subscribe(params => {
      const category = params['category'] || '';
      this.selectedCategory = category;
      this.filterService.setCategory(category);
    });
  }

  selectCategory(cat: string) {
    this.router.navigate(['/liste-products'], {
      queryParams: { category: cat },
      queryParamsHandling: 'merge'
    });
  }

  clearCategory() {
    this.router.navigate(['/liste-products'], {
      queryParams: { category: null },
      queryParamsHandling: 'merge'
    });
  }
}