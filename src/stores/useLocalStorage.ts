import { create } from "zustand";

interface Location {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  current: boolean;
}

interface WeatherData {
  data: any;
  timestamp: number;
}

interface ShortWeatherData {
  code: string;
  isday: number;
  timestamp: number;
}

interface AppSettings {
  autoRefresh: number;
  radiusThreshold: number;
}

interface LocalStorageState {
  locations: Location[];
  weatherData: Record<string, WeatherData>;
  shortWeatherData: Record<string, ShortWeatherData>;
  settings: AppSettings | null;
  saveLocation: (location: any, isCurrent: boolean, isParam: boolean) => void;
  removeLocation: (id: string) => void;
  saveWeatherData: (locationId: string, data: any) => void;
  saveShortWeatherData: (locationId: string, code: string, isday: number) => void;
  saveSettings: (values: AppSettings) => void;
  clearLocations: () => void;
}

const isClient = typeof window !== "undefined";

export const useLocalStorageStore = create<LocalStorageState>((set, get) => ({
  locations: isClient ? JSON.parse(localStorage.getItem("Locations") || "[]") : [],
  weatherData: isClient ? JSON.parse(localStorage.getItem("weatherData") || "{}") : {},
  shortWeatherData: isClient ? JSON.parse(localStorage.getItem("shortweatherdata") || "{}") : {},
  settings: isClient ? JSON.parse(localStorage.getItem("Settings") || "null") : null,

  saveLocation: (location, isCurrent, isParam) => {
    if (!isClient) return;
    let updatedLocations = [...get().locations];
    let newLocation : Location;
    if(isParam){
      newLocation = location
    }else{
      const typeMap: Record<string, string> = {node: 'N', way: 'W', relation: 'R'}

      const id = `${typeMap[String(location.osm_type).toLocaleLowerCase()]}${location.osm_id}`
      if (isCurrent) {
        updatedLocations = updatedLocations.filter((loc) => !loc.current);
      } else if (updatedLocations.some((loc) => loc.id === id)) {
        return;
      }

      if (updatedLocations.length >= 31) {
        updatedLocations.shift();
      }

      const name = isCurrent
        ? location.address.city || location.address.town || location.address.village || location.name || 'Unknown location'
        : location.display_name.split(',')[0]?.trim();
      const country = isCurrent ? location.address.country : location.display_name.split(',').pop()?.trim();

      newLocation = {
        id: id,
        name,
        country,
        lat: location.lat,
        lon: location.lon,
        current: isCurrent,
      };
  }

    isCurrent ? updatedLocations.unshift(newLocation) : updatedLocations.push(newLocation);
    
    set({ locations: updatedLocations });
    localStorage.setItem('Locations', JSON.stringify(updatedLocations));
    return newLocation;
  },

  removeLocation: (id) => {
    if (!isClient) return;

    set((state) => {
      const updatedLocations = state.locations.filter((loc) => String(loc.id) !== id);
      const updatedWeatherData = { ...state.weatherData };
      const updatedShortWeatherData = { ...state.shortWeatherData };

      delete updatedWeatherData[id];
      delete updatedShortWeatherData[id];

      localStorage.setItem("Locations", JSON.stringify(updatedLocations));
      localStorage.setItem("weatherData", JSON.stringify(updatedWeatherData));
      localStorage.setItem("shortweatherdata", JSON.stringify(updatedShortWeatherData));

      return { locations: updatedLocations, weatherData: updatedWeatherData, shortWeatherData: updatedShortWeatherData };
    });
  },

  saveWeatherData: (locationId, data) => {
    if (!isClient) return;
    
    set((state) => {
      const updatedData = { ...state.weatherData, [locationId]: { data, timestamp: Date.now() } };
      localStorage.setItem("weatherData", JSON.stringify(updatedData));
      return { weatherData: updatedData };
    });
  },

  saveShortWeatherData: (locationId, code, isday) => {
    if (!isClient) return;
    
    set((state) => {
      const updatedData = { ...state.shortWeatherData, [locationId]: { code, isday, timestamp: Date.now() } };
      localStorage.setItem("shortweatherdata", JSON.stringify(updatedData));
      return { shortWeatherData: updatedData };
    });
  },

  saveSettings: (values) => {
    if (!isClient) return;
    
    set(() => {
      localStorage.setItem("Settings", JSON.stringify(values));
      return { settings: values };
    });
  },

  clearLocations: () => {
    if (!isClient) return;
    
    set(() => {
      localStorage.removeItem("weatherData");
      localStorage.removeItem("shortweatherdata");
      localStorage.removeItem("Locations");
      return { locations: [], weatherData: {}, shortWeatherData: {} };
    });
  },
}));