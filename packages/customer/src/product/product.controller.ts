import { isValidObjectId } from 'mongoose';
import {
  Get,
  JsonController,
  BadRequestError,
  NotFoundError,
  QueryParam,
  Param,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { ProductService } from './product.service';

@JsonController('/product')
export class ProductController {
  private readonly ProductService = new ProductService();

  @OpenAPI({
    description: 'get List Products',
  })
  @Get('/', { transformResponse: false })
  async getListProducts(
    @QueryParam('status')
    status: string,
    @QueryParam('category')
    category: string,
    @QueryParam('scent')
    scent: string,
    @QueryParam('page')
    page: number,
    @QueryParam('limit')
    limit: number,
  ) {
    try {
      return this.ProductService.getListProducts(
        page,
        limit,
        status,
        category,
        scent,
      );
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    description: 'get Products details',
  })
  @Get('/:product_id', { transformResponse: false })
  async getProductByID(@Param('product_id') product_id: string) {
    try {
      if (!isValidObjectId(product_id))
        throw new BadRequestError('Invalid Product_id');
      return this.ProductService.getProductByID(product_id);
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }
}
