
import { Icon, Marker, type LatLngExpression, type MarkerOptions } from "leaflet";
import { type ADDRESS_LEVEL_STRING } from "@/types";

import MainMarkerIcon from "@/assets/icons/marker_main.png";
import GeneralMarkerIcon from "@/assets/icons/marker_general.png";

const mainIcon = new Icon({ iconUrl: MainMarkerIcon, iconSize: [ 30, 30 ] });
const generalIcon = new Icon({ iconUrl: GeneralMarkerIcon, iconSize: [ 30, 30 ] });

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
 * generate marker core
 * @param latLng 
 * @param markerTitle 
 * @param icon
 * @returns 
 */
function generateMarker(latLng: LatLngExpression, markerTitle: string, icon: Icon) {
  const markerOption: MarkerOptions = {
    icon: icon,
    title: markerTitle,
  };
  
  return new Marker(latLng, markerOption);
};
/**
 * Generate general marker for the Leaflet Map.
 * @param latLng 
 * @param markerTitle 
 * @returns 
 */
export function generateGeneralMarker(latLng: LatLngExpression, markerTitle: string): Marker {
  return generateMarker(latLng, markerTitle, generalIcon);
}

/**
 * Generate main marker for the Leaflet Map.
 * @param latLng 
 * @param markerTitle 
 * @returns 
 */
export function generateMainMarker(latLng: LatLngExpression, markerTitle: string): Marker {
  return generateMarker(latLng, markerTitle, mainIcon);
}



export function convertToAddressLevelNumber(type: ADDRESS_LEVEL_STRING): number {
  return addressLevelMap.get(type) || 10;
}