import { GeoRepository } from './geo.repository';

export class GeoService {
  private readonly geoRepository = new GeoRepository();

  async getCountryByCode(code: string) {
    return this.geoRepository.getCountryByCode(code);
  }

  async getCityByCode(code: string) {
    return this.geoRepository.getCityByCode(code);
  }

  async getCityByCountryCode(country_code: string) {
    return this.geoRepository.getCityByCountryCode(country_code);
  }

  async getDistrictByCode(code: string) {
    return this.geoRepository.getDistrictByCode(code);
  }

  async getDistrictByCityCode(city_code: string) {
    return this.geoRepository.getDistrictByCityCode(city_code);
  }

  async getWardByCode(code: string) {
    return this.geoRepository.getWardByCode(code);
  }

  async getWardByDistrictCode(district_code: string) {
    return this.geoRepository.getWardByDistrictCode(district_code);
  }

  async getAllCountries() {
    return this.geoRepository.getAllCountries();
  }

  async getAllCities() {
    return this.geoRepository.getAllCities();
  }

  async getAllDistricts() {
    return this.geoRepository.getAllDistricts();
  }

  async getAllWards() {
    return this.geoRepository.getAllWards();
  }
}
