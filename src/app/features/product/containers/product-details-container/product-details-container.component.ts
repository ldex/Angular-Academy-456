import { Component, inject, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailsComponent } from '../../components/product-details/product-details.component';
import { CartService } from '../../../../services/cart.service';
import { AuthService } from '../../../../services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductStore } from '../../product.store';

@Component({
  selector: 'app-product-details-container',
  imports: [CommonModule, ProductDetailsComponent],
  template: `
    <app-product-details
      [product]="product()"
      [error]="error()"
      [loading]="loading()"
      [isAuthenticated]="isAuthenticated()"
      (addToCart)="onAddToCart($event)"
      (delete)="onDelete($event)">
    </app-product-details>
  `
})
export class ProductDetailsContainerComponent {
  private store = inject(ProductStore);
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  product = this.store.selectedProduct;
  error = this.store.error;
  loading = this.store.loading;

  private authState = toSignal(this.authService.getAuthState());
  protected isAuthenticated = computed(() => this.authState()?.isAuthenticated ?? false);

  id = input.required<number>()

  ngOnInit() {
     this.store.clearSelectedProduct()
     this.store.loadProduct(this.id())
  }

  onAddToCart(productId: number): void {
    this.cartService.addToCart(productId);
  }

  onDelete(productId: number): void {
      this.store.deleteProduct(productId)
  }
}