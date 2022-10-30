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
  CurrentUser,
  Delete,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { UserDocument } from '../user/user.model';
import { CreateShippingAddressDto } from './dtos/createShippingAddress.dto';
import { UpdateShippingAddressDto } from './dtos/updateShippingAddress.dto';
import { ShippingAddressService } from './shipping_address.service';

@JsonController('/shipping_address')
export class ShippingAddressController {
  private readonly shippingAddressService = new ShippingAddressService();

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'get List Shipping Addresses',
  })
  @Authorized(['customer'])
  @Get('/', { transformResponse: false })
  async getListShippingAddresses(
    @QueryParam('page')
    page: number,
    @QueryParam('limit')
    limit: number,
    @CurrentUser({ required: true }) user: UserDocument,
  ) {
    try {
      return this.shippingAddressService.getListShippingAddresss(
        page,
        limit,
        user._id,
      );
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'get ShippingAddresss details',
  })
  @Authorized(['customer'])
  @Get('/:shipping_address_id', { transformResponse: false })
  async getShippingAddressByID(
    @CurrentUser({ required: true }) user: UserDocument,
    @Param('shipping_address_id') shipping_address_id: string,
  ) {
    try {
      if (!isValidObjectId(shipping_address_id))
        throw new BadRequestError('Invalid shipping_address_id');
      return this.shippingAddressService.getShippingAddressByID(
        shipping_address_id,
        user._id,
      );
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @Authorized(['customer'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'create ShippingAddresss information details',
  })
  @Post('', { transformResponse: false })
  async createShippingAddress(
    @CurrentUser({ required: true }) user: UserDocument,
    @Body() createShippingAddressDto: CreateShippingAddressDto,
    @Res() res: Response,
  ) {
    try {
      await this.shippingAddressService.createShippingAddress(
        createShippingAddressDto,
        user._id,
      );
      res.status(201);
      return {
        message: 'Created Successfully',
      };
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @Authorized(['customer'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'update ShippingAddresss information details',
  })
  @Put('/:shipping_address_id', { transformResponse: false })
  async updateShippingAddress(
    @Body() updateShippingAddressDto: UpdateShippingAddressDto,
    @Param('shipping_address_id') shipping_address_id: string,
    @CurrentUser({ required: true }) user: UserDocument,
  ) {
    try {
      return this.shippingAddressService.updateShippingAddress(
        shipping_address_id,
        updateShippingAddressDto,
        user._id,
      );
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Delete ShippingAddresss by ID',
  })
  @Authorized(['customer'])
  @Delete('/:shipping_address_id', { transformResponse: false })
  async deleteShippingAddressByID(
    @CurrentUser({ required: true }) user: UserDocument,
    @Param('shipping_address_id') shipping_address_id: string,
  ) {
    try {
      if (!isValidObjectId(shipping_address_id))
        throw new BadRequestError('Invalid shipping_address_id');
      if (
        !(await this.shippingAddressService.deleteShippingAddress(
          shipping_address_id,
          user._id,
        ))
      ) {
        throw new BadRequestError('Not found to delete this shipping address');
      }
      return {
        message: 'Deleted Successfully',
      };
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }
}
