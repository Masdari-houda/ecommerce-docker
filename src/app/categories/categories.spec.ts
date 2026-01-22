import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Categories } from './categories';
import { ProductService } from '../product-service';
import { FilterService } from '../filter.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';

describe('Categories', () => {
  let component: Categories;
  let fixture: ComponentFixture<Categories>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockFilterService: jasmine.SpyObj<FilterService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let queryParamsSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', ['getProducts']);
    mockProductService.getProducts.and.returnValue(of({ products: [] }));

    mockFilterService = jasmine.createSpyObj('FilterService', ['setCategory']);

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    queryParamsSubject = new BehaviorSubject({});
    const mockActivatedRoute = {
      queryParams: queryParamsSubject.asObservable()
    };

    await TestBed.configureTestingModule({
      imports: [Categories],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: FilterService, useValue: mockFilterService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Categories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate with query params when category is selected', () => {
    const category = 'test-category';
    component.selectCategory(category);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/liste-products'], {
      queryParams: { category: category },
      queryParamsHandling: 'merge'
    });
  });

  it('should clear category (navigate with null) when clearCategory is called', () => {
    component.clearCategory();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/liste-products'], {
      queryParams: { category: null },
      queryParamsHandling: 'merge'
    });
  });

  it('should update selectedCategory and filterService when URL params change', () => {
    const category = 'new-category';
    queryParamsSubject.next({ category: category });
    expect(component.selectedCategory).toBe(category);
    expect(mockFilterService.setCategory).toHaveBeenCalledWith(category);
  });
});
