import axios, { type CancelTokenSource } from "axios";
import qs from "query-string";
import { type Nominatim } from "../types";
const OPENSTREETMAP_API = "https://nominatim.openstreetmap.org";
const FORMAT = "jsonv2";

/**
 * Get the user's current location.
 * @param lat latitude
 * @param lon longitude
 * @returns human readable address
 */
export async function getCurrentAddress(lat: number, lon: number): Promise<Nominatim> {
  const qsObj = {
    format: FORMAT,
    lat,
    lon
  }
  const openStreetMapResp = await axios.get<Nominatim>(`${OPENSTREETMAP_API}/reverse?${qs.stringify(qsObj)}`);
  return openStreetMapResp.data;
}

/**
 * Search address suggest list by key word.
 * @param searchString address key word
 * @param limit default 5 results
 * @returns 
 */
export async function searchAddressListByString(searchString: string, limit: number = 5): Promise<Nominatim[]> {
  const qsObj = {
    limit,
    format: FORMAT,
    q: searchString,
  }
  const openStreetMapResp = await axios.get<Nominatim[]>(`${OPENSTREETMAP_API}/search?${qs.stringify(qsObj)}`, {
    // signal: abortController.signal,
    // cancelToken: tokenSource.token,
  });
  return openStreetMapResp.data;
  // const openStreetMapResp = await axios.get<Nominatim[]>(`${OPENSTREETMAP_API}/search?${qs.stringify(qsObj)}`, {
  //   signal: abortController.signal,
  // });
  // return openStreetMapResp.data;
}