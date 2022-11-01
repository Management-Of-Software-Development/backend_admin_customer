import { Response } from 'express';
import { isValidObjectId } from 'mongoose';
import {
  Get,
  JsonController,
  BadRequestError,
  NotFoundError,
  QueryParam,
  Param,
  Authorized,
  Post,
  Body,
  Res,
  Put,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { AppreciationProductService } from './appreciation_product.service';
import { ConvertCommercialToGiftProductDto } from '../commercial_product/dtos/convertCommercialToGiftProduct.dto';
import { CreateGiftDto } from './dtos/createGift.dto';
import { UpdateGiftDto } from './dtos/updateGift.dto';

@JsonController('/appreciationProduct')
export class AppreciationProductController {
  private readonly appreciationProductService = new AppreciationProductService();

  @OpenAPI({
    description: 'get List Appreciation Products',
    security: [{ BearerAuth: [] }],
  })
  @Authorized(['admin', 'staff'])
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
      return this.appreciationProductService.getListProducts(
        page,
        limit,
        category,
        scent,
        status,
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
  @Authorized(['admin', 'staff'])
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

  @Authorized(['admin', 'staff'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'create Products information details',
  })
  @Post('', { transformResponse: false })
  async createProduct(
    @Body() createGiftDto: CreateGiftDto,
    @Res() res: Response,
  ) {
    try {
      await this.appreciationProductService.createProduct(createGiftDto);
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
  @Put('/:product_id', { transformResponse: false })
  async updateProduct(
    @Body() updateGiftDto: UpdateGiftDto,
    @Param('product_id') commercial_product_id: string,
  ) {
    try {
      return this.appreciationProductService.updateCommercialProduct(
        commercial_product_id,
        updateGiftDto,
      );
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }
}
