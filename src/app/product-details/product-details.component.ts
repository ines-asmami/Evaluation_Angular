import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Product } from '../model/product';
import { ProductService } from '../services/product.service';
import { CustomerService } from '../services/customer.service';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})

export class ProductDetailsComponent {

  @Output()
  addToBasket = new EventEmitter<Product>();

  @Input()
  data: Product;
  products: Product[] = [];
  sortKey: keyof Product = 'title';
  total = 0;


  constructor(private productService: ProductService,
    private customerService: CustomerService,
    private route: ActivatedRoute)
    {
      productService.getProducts().subscribe(products => {
        this.products = products;
      });
    }

    ngOnInit() {
      this.route.params.subscribe( (params: Params):void => {
        let id = params ['id'];
        this.productService.getDetails(id).subscribe(data => {
          this.data = data;
        });
      });

    }

    addToBasketClick() {
      this.addToBasket.emit(this.data);
    }

    updateBasket(event:Product) {
      this.customerService.addProduct(event);
      this.productService.decreaseStock(event);
    }

    isTheLast() {
      return this.productService.isTheLast(this.data);
    }

    updatePrice(event: Product): void {
      this.customerService.addProduct(event);
      this.productService.decreaseStock(event);
      this.updateTotal();
    }

    updateTotal(): void {
      this.customerService.getTotal().subscribe(total => {
        this.total = total;
      });
    }

    isAvailable(product: Product): boolean {
      return this.productService.isAvailable(product);
    }

}
