import { DocumentType } from '@typegoose/typegoose';
import { City, CityModel } from './city.model';
import { Country, CountryModel } from './country.model';
import { District, DistrictModel } from './district.model';
import { WardModel } from './ward.model';

export class GeoRepository {
  async getCountryByCode(code: string): Promise<DocumentType<Country> | null> {
    return CountryModel.findOne({ code })
      .select({
        _id: 0,
        code: 1,
        name: 1,
      })
      .lean();
  }

  async getCityByCode(code: string): Promise<DocumentType<City> | null> {
    return CityModel.findOne({ code })
      .select({
        _id: 0,
        code: 1,
        name: 1,
        country_code: 1,
      })
      .lean();
  }

  async getCityByCountryCode(country_code: string) {
    return CityModel.find({ country_code })
      .select({
        _id: 0,
        code: 1,
        name: 1,
        country_code: 1,
      })
      .lean();
  }

  async getDistrictByCode(
    code: string,
  ): Promise<DocumentType<District> | null> {
    return DistrictModel.findOne({ code })
      .select({
        _id: 0,
        code: 1,
        name: 1,
        city_code: 1,
      })
      .lean();
  }

  async getDistrictByCityCode(city_code: string) {
    return DistrictModel.find({ city_code })
      .select({
        _id: 0,
        code: 1,
        name: 1,
        city_code: 1,
      })
      .lean();
  }

  async getWardByCode(code: string): Promise<DocumentType<District> | null> {
    return WardModel.findOne({ code })
      .select({
        _id: 0,
        code: 1,
        name: 1,
        district_code: 1,
      })
      .lean();
  }

  async getWardByDistrictCode(district_code: string) {
    return WardModel.find({ district_code })
      .select({
        _id: 0,
        code: 1,
        name: 1,
        district_code: 1,
      })
      .lean();
  }

  async getAllCountries() {
    return CountryModel.find().lean();
  }

  async getAllCities() {
    return CityModel.find().lean();
  }

  async getAllDistricts() {
    return DistrictModel.find().lean();
  }

  async getAllWards() {
    return WardModel.find().lean();
  }
}
