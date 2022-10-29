import {
  JsonController,
  Get,
  Param,
  BadRequestError,
} from 'routing-controllers';
import { GeoService } from './geo.service';

@JsonController('/geo')
export class GeoController {
  private readonly geoService = new GeoService();

  @Get('/countries', { transformResponse: false })
  async getAllCountries() {
    return this.geoService.getAllCountries();
  }

  @Get('/countries/:code')
  async getCountryByCode(@Param('code') code: string) {
    try {
      return this.geoService.getCityByCode(code);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  @Get('/cities', { transformResponse: false })
  async getAllCities() {
    return this.geoService.getAllCities();
  }

  @Get('/cities/:code')
  async getCityByCode(@Param('code') code: string) {
    try {
      return this.geoService.getCityByCode(code);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  @Get('/cities/bycountry/:country_code')
  async getCityByCountryCode(@Param('country_code') country_code: string) {
    try {
      return this.geoService.getCityByCountryCode(country_code);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  @Get('/districts', { transformResponse: false })
  async getAllDistricts() {
    return this.geoService.getAllDistricts();
  }

  @Get('/districts/:code')
  async getDistrictByCode(@Param('code') code: string) {
    try {
      return this.geoService.getDistrictByCode(code);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  @Get('/districts/bycity/:city_code')
  async getDistrictByCityCode(@Param('city_code') city_code: string) {
    try {
      return this.geoService.getDistrictByCityCode(city_code);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  @Get('/wards', { transformResponse: false })
  async getAllWards() {
    return this.geoService.getAllWards();
  }

  @Get('/wards/:code', { transformResponse: false })
  async getWardByCode(@Param('code') code: string) {
    try {
      return this.geoService.getWardByCode(code);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  @Get('/wards/bydistrict/:district_code')
  async getWardByDistrictCode(@Param('district_code') district_code: string) {
    try {
      return this.geoService.getWardByDistrictCode(district_code);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}
