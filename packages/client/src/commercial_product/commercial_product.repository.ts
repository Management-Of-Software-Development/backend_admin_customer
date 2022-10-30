import { NotFoundError } from 'routing-controllers';
import { ScentCategoryModel } from '../scent_category/scent-category.model';
import { CategoryModel } from '../category/category.model';
import {
  CommercialProductModel,
  CommercialProductDocument,
} from './commercial_product.model';

export class CommercialProductRepository {
  async getListProducts(
    page: number,
    limit: number,
    status: string,
    category_slug: string,
    scent_slug: string,
  ) {
    let aggregation = CommercialProductModel.aggregate().match({});
    if (status) {
      aggregation = aggregation.match({
        status: { $in: status.split(',').map((x) => +x) },
      });
    }
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
  ): Promise<CommercialProductDocument> {
    const product_info = await CommercialProductModel.findOne({
      _id: product_id,
    })
      .populate('category')
      .exec();
    if (!product_info) {
      throw new NotFoundError('This Product  does not exist !');
    }
    return product_info;
  }
}
