export interface Nominatim {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  place_rank: number
  category: string;
  type: string;
  importance: number;
  addresstype: string;
  display_name: string;
  address: {
    house_number: string;
    road: string;
    quarter: string;
    suburb: string;
    city: string;
    state_district: string;
    state: string;
    "ISO3166-2-lvl4": string;
    postcode: string;
    country: string;
    country_code: string;
  }
  boundingbox: {
    "0": string;
    "1": string;
    "2": string;
    "3": string;
  }
}
