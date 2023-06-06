import axios, { type CancelTokenSource } from "axios";
import qs from "query-string";
import { type Nominatim, type GoogleTimeZoneInfo } from "../types";
const OPENSTREETMAP_API = "https://nominatim.openstreetmap.org";
const GOOGLEMAP_API = `https://maps.googleapis.com/maps/api/timezone/json`
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

export async function getTimeZoneFromGoogleApi(lat: number, lon: number) {
  const qsObj = {
    location: `${lat},${lon}`,
    timestamp: Math.floor(Date.now() / 1000),
    key: "AIzaSyAP_nd3jksr1e5Bxma6cFR9wMZlSJFM8W4",
  };
  const googleLocationResp = await axios.get<GoogleTimeZoneInfo>(`${GOOGLEMAP_API}?${qs.stringify(qsObj)}`);
  return googleLocationResp.data;

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