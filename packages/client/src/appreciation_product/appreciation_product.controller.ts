import { isValidObjectId } from 'mongoose';
import {
  Get,
  JsonController,
  BadRequestError,
  NotFoundError,
  QueryParam,
  Param,
  Authorized,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { AppreciationProductService } from './appreciation_product.service';

@JsonController('/appreciationProduct')
export class AppreciationProductController {
  private readonly appreciationProductService = new AppreciationProductService();

  @OpenAPI({
    description: 'get List Appreciation Products',
    security: [{ BearerAuth: [] }],
  })
  @Authorized(['customer'])
  @Get('/', { transformResponse: false })
  async getListProducts(
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
      return this.appreciationProductService.getListProducts(
        page,
        limit,
        category,
        scent,
      );
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    description: 'get details of Appreciation Products',
    security: [{ BearerAuth: [] }],
  })
  @Authorized(['customer'])
  @Get('/:product_id', { transformResponse: false })
  async getProductByID(@Param('product_id') product_id: string) {
    try {
      if (!isValidObjectId(product_id))
        throw new BadRequestError('Invalid Product_id');
      return this.appreciationProductService.getProductByID(product_id);
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }
}
