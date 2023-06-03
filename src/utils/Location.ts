import axios from "axios";
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
export async function getCurrentAddress(lat: number, lon: number): Promise<string> {
  const qsObj = {
    format: FORMAT,
    lat,
    lon
  }
  const openStreetMapResp = await axios.get<Nominatim>(`${OPENSTREETMAP_API}/reverse?${qs.stringify(qsObj)}`);
  return openStreetMapResp.data.display_name;
}