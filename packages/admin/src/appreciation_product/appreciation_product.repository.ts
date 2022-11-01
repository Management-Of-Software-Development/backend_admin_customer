import { NotFoundError } from 'routing-controllers';
import { ScentCategoryModel } from '../scent_category/scent-category.model';
import { CategoryModel } from '../category/category.model';
import {
  AppreciationProductModel,
  AppreciationProductDocument,
} from './appreciation_product.model';
import { ProductStatus } from '../product/enums/product-status.enum';
import { CommercialProductModel } from '../commercial_product/commercial_product.model';
import { CreateGiftDto } from './dtos/createGift.dto';
import { UpdateGiftDto } from './dtos/updateGift.dto';
import { ConvertCommercialToGiftProductDto } from '../commercial_product/dtos/convertCommercialToGiftProduct.dto';

export class AppreciationProductRepository {
  async getListProducts(
    page: number,
    limit: number,
    category_slug: string,
    scent_slug: string,
    status: string,
  ) {
    let aggregation = AppreciationProductModel.aggregate().match({});
    if (category_slug) {
      const categoryObjectIdArray = (
        await CategoryModel.find({
          slug: { $in: category_slug.split(',') },
        })
      ).map((categories) => categories._id);
      aggregation = aggregation.match({
        category: { $in: categoryObjectIdArray },
      });
    }
    if (status) {
      aggregation = aggregation.match({
        status: { $in: status.split(',').map((x) => +x) },
      });
    }
    if (scent_slug) {
      let scentArray = scent_slug.split(',');
      const categoryArray = (await CategoryModel.find({}).lean()).map(
        (x) => x.slug,
      );
      scentArray = scentArray.filter((val) => !categoryArray.includes(val));
      if (scentArray && scentArray.length >= 1) {
        const scentObjectIdArray = (
          await ScentCategoryModel.find({
            slug: { $in: scentArray },
          })
        ).map((scents) => scents._id);
        aggregation = aggregation.match({
          scent_category: { $in: scentObjectIdArray },
        });
      }
    }
    aggregation = aggregation
      .facet({
        paginationInfo: [
          {
            $count: 'total',
          },
          {
            $addFields: {
              page,
              limit,
            },
          },
        ],
        data: [
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $lookup: {
              from: CategoryModel.collection.name,
              let: {
                id: '$category',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$_id', '$$id'],
                    },
                  },
                },
                {
                  $project: {
                    description: 0,
                  },
                },
              ],
              as: 'category',
            },
          },
          {
            $unwind: '$category',
          },
        ],
      })
      .unwind('paginationInfo');
    aggregation.unwind('$paginationInfo');
    const [results] = await aggregation.exec();
    if (!results) return null;
    return results;
  }

  async getProductDetailByID(
    product_id: string,
  ): Promise<AppreciationProductDocument> {
    const product_info = await AppreciationProductModel.findOne({
      _id: product_id,
    })
      .populate('category')
      .exec();
    if (!product_info) {
      throw new NotFoundError('This Product  does not exist !');
    }
    return product_info;
  }

  async createProduct(createProductDto: CreateGiftDto) {
    const newProduct = new AppreciationProductModel({
      ...createProductDto,
      status: ProductStatus.IN_STOCK,
    });
    await newProduct.save();
  }

  async updateCommercialProduct(
    commercial_product_id: string,
    updateProductDto: UpdateGiftDto,
  ) {
    const updatedProduct = await AppreciationProductModel.findOneAndUpdate(
      { _id: commercial_product_id },
      { ...updateProductDto },
      {
        new: true,
      },
    );
    return updatedProduct;
  }
}
