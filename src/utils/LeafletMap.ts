
import { Marker, type LatLngExpression, type MarkerOptions } from "leaflet";
import { type ADDRESS_LEVEL_STRING } from "@/types";
const addressLevelMap = new Map<ADDRESS_LEVEL_STRING, number>([
  ["house", 15],
  ["street", 14],
  ["trunk", 16],
  ["district", 13],
  ["religious", 13],
  ["place_of_worship", 13],
  ["administrative", 4],
  ["industrial", 10],
  ["village", 10],
  ["suburb", 10],
  ["hamlet", 10],
  ["city", 9],
  ["municipality", 9],
  ["county", 3],
  ["state", 4],
  ["country", 3],
  ["locality", 5],
]);

/**
 * Generate main marker for the Leaflet Map.
 * @param latLng 
 * @param markerTitle 
 * @returns 
 */
export function generateMainMarker(latLng: LatLngExpression, markerTitle: string): Marker {
  const markerOption: MarkerOptions = {
    title: markerTitle,
  };
  
  return new Marker(latLng, markerOption);
}

export function convertToAddressLevelNumber(type: ADDRESS_LEVEL_STRING): number {
  return addressLevelMap.get(type) || 10;
}