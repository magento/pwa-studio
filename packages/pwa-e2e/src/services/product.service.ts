import { HttpService } from './http.service';

export class ProductService extends HttpService {
  public getProducts(): Promise<any> {
    return super.get('/products');
  }
}

const productService = new ProductService();
productService.getProducts();