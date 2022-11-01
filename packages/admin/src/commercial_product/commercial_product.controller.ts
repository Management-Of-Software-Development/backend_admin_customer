import { Response } from 'express';
import { isValidObjectId } from 'mongoose';
import {
  Get,
  JsonController,
  BadRequestError,
  NotFoundError,
  QueryParam,
  Authorized,
  Param,
  Post,
  Body,
  Res,
  Put,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { CreateProductDto } from './dtos/createProduct.dto';
import { UpdateProductDto } from './dtos/updateProduct.dto';
import { CommercialProductService } from './commercial_product.service';
import { ConvertCommercialToGiftProductDto } from './dtos/convertCommercialToGiftProduct.dto';

@JsonController('/product')
export class CommercialProductController {
  private readonly commercialProductService = new CommercialProductService();

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
      return this.commercialProductService.getListProducts(
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
      return this.commercialProductService.getCommercialProductByID(product_id);
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @Authorized(['admin', 'staff'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'create Products information details',
  })
  @Post('', { transformResponse: false })
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Res() res: Response,
  ) {
    try {
      await this.commercialProductService.createProduct(createProductDto);
      res.status(201);
      return {
        message: 'Created Successfully',
      };
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @Authorized(['admin', 'staff'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'update Products information details',
  })
  @Put('/detail/:product_id', { transformResponse: false })
  async updateProduct(
    @Body() updateProductDto: UpdateProductDto,
    @Param('product_id') commercial_product_id: string,
  ) {
    try {
      return this.commercialProductService.updateCommercialProduct(
        commercial_product_id,
        updateProductDto,
      );
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @Authorized(['admin', 'staff'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'update Products information details',
  })
  @Put('/convert/:product_id', { transformResponse: false })
  async convertCommercialToGiftProduct(
    @Body({ required: true }) convertGiftDto: ConvertCommercialToGiftProductDto,
    @Param('product_id') commercial_product_id: string,
  ) {
    try {
      await this.commercialProductService.convertCommercialToGiftProduct(
        commercial_product_id,
        convertGiftDto,
      );
      return {
        message: 'Converted successfully',
      };
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }
}
