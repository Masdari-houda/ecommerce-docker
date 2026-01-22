import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.css']
})
export class SearchBar implements OnInit {
  query = '';
  private timeout: any;

  @Output() search = new EventEmitter<string>();

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.query = params['search'];
        this.search.emit(this.query);
      }
    });
  }

  onInputChange() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.updateUrl();
    }, 400);
  }

  onSearch() {
    clearTimeout(this.timeout);
    this.updateUrl();
  }

  private updateUrl() {
    const q = this.query.trim();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: q || null },
      queryParamsHandling: 'merge'
    });
    this.search.emit(q);
  }
}