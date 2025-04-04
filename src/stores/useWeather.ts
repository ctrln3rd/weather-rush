import { create } from "zustand";

// Define types
export interface WeatherCondition {
  codes: number[];
  icon: string;
  gradient: string;
  gradientNight: string;
  animation: string;
  themeDay: string;
  themeNight: string;
}

export interface MoonPhase {
  text: string;
  image: string;
}
 export type Conditions = 'clear' | 'pcloudy' | 'cloudy' | 'drizzle' | 'rain' | 'fog' | 'snow' | 'thunderstorm';

// Weather conditions
const codeDetails: Record<string, WeatherCondition> = {
  clear: {
    codes: [0],
    icon: "clear",
    gradient: "bg-gradient-to-b from-sky-800 to-yellow-600",
    gradientNight: "bg-gradient-to-b from-indigo-900 to-black",
    themeDay: "#00598A",  // Hex for 'from-sky-800 to-yellow-600'
    themeNight: "#312c85", // Hex for 'from-indigo-900 to-black'
    animation: "",
  },
  "mostly clear": {
    codes: [1],
    icon: "clear",
    gradient: "bg-gradient-to-b from-sky-800 to-yellow-600",
    gradientNight: "bg-gradient-to-b from-indigo-900 to-black",
    themeDay: "#00598A",  // Hex for 'from-sky-800 to-yellow-600'
    themeNight: "#312c85", // Hex for 'from-indigo-900 to-black'
    animation: "",
  },
  "partly cloudy": {
    codes: [2],
    icon: "pcloudy",
    gradient: "bg-gradient-to-b from-sky-800 to-blue-900",
    gradientNight: "bg-gradient-to-b from-indigo-900 to-black",
    themeDay: "#00598A",  // Hex for 'from-sky-800 to-blue-900'
    themeNight: "#312c85", // Hex for 'from-indigo-900 to-black'
    animation: "animate-few-clouds",
  },
  cloudy: {
    codes: [3],
    icon: "cloudy",
    gradient: "bg-gradient-to-b from-slate-600 to-gray-900",
    gradientNight: "bg-gradient-to-b from-gray-800 to-black",
    themeDay: "#45556c", // Hex for 'from-slate-600 to-gray-900'
    themeNight: "#1E2939", // Hex for 'from-gray-800 to-black'
    animation: "animate-clouds",
  },
  drizzle: {
    codes: [51, 53, 55, 56, 57],
    icon: "drizzle",
    gradient: "bg-gradient-to-b from-gray-500 to-gray-900",
    gradientNight: "bg-gradient-to-b from-gray-800 to-black",
    themeDay: "#6A7282", // Hex for 'from-gray-500 to-gray-900'
    themeNight: "#1E2939", // Hex for 'from-gray-800 to-black'
    animation: "animate-light-rain",
  },
  rain: {
    codes: [61, 63, 65, 66, 67],
    icon: "rain",
    gradient: "bg-gradient-to-b from-gray-600 to-gray-900",
    gradientNight: "bg-gradient-to-b from-gray-800 to-black",
    themeDay: "#4A5565", // Hex for 'from-gray-600 to-gray-900'
    themeNight: "#1E2939", // Hex for 'from-gray-800 to-black'
    animation: "animate-rain",
  },
  "rain showers": {
    codes: [80, 81, 82],
    icon: "rain",
    gradient: "bg-gradient-to-b from-gray-600 to-gray-900",
    gradientNight: "bg-gradient-to-b from-gray-800 to-black",
    themeDay: "#4a5565",
    themeNight: "#1E2939",
    animation: "animate-rain",
  },
  thunderstorm: {
    codes: [95, 96, 99],
    icon: "thunderstorm",
    gradient: "bg-gradient-to-b from-gray-600 to-gray-900",
    gradientNight: "bg-gradient-to-b from-gray-800 to-black",
    themeDay: "#4a5565",
    themeNight: "#1E2939",
    animation: "animate-lightning",
  },
  snow: {
    codes: [71, 73, 75, 77],
    icon: "snow",
    gradient: "bg-gradient-to-b from-blue-200 to-gray-500",
    gradientNight: "bg-gradient-to-b from-purple-900 to-black",
    themeDay: "#BEDBFF", // Hex for 'from-blue-200 to-gray-500'
    themeNight: "#59168B", // Hex for 'from-purple-900 to-black'
    animation: "animate-snow",
  },
  fog: {
    codes: [45, 48],
    icon: "fog",
    gradient: "bg-gradient-to-b from-blue-200 to-gray-900",
    gradientNight: "bg-gradient-to-b from-gray-700 to-black",
    themeDay: "#BEDBFF", // Hex for 'from-blue-200 to-gray-900'
    themeNight: " #364153", // Hex for 'from-gray-700 to-black'
    animation: "animate-fog",
  },
};



// Helper functions stored inside Zustand
export const useWeatherConfigStore = create<{
  getCodeCondition: (code: number) => string;
  getCodeBackground: (code: number, isDay: boolean) => string;
  getThemeColor: (code: number, isDay: boolean) => string;
  getCodeAnimation: (code: number) => string;
  getCodeIcon: (code: number) => Conditions;
  formatWind: (wind: number) => string;
  formatWindDirection: (deg: number) => string;

  
}>(() => ({

  getCodeCondition: (code) => {
    for (let condition in codeDetails) {
      if (codeDetails[condition].codes.includes(code)) return condition;
    }
    return "unknown";
  },

  getCodeBackground: (code, isDay) => {
    const condition = Object.values(codeDetails).find(({ codes }) => codes.includes(code));
    if (condition) {
      return isDay ? condition.gradient : condition.gradientNight;
    }
    return "bg-gradient-to-b from-gray-600 to-gray-900";
  },
   getThemeColor: (code, isDay)=>{
    const condition = Object.values(codeDetails).find(({ codes }) => codes.includes(code));
    if (condition) {
      return isDay ? condition.themeDay : condition.themeNight;
    }
    return " ";

   },
  getCodeAnimation: (code) => {
    return Object.values(codeDetails).find(({ codes }) => codes.includes(code))?.animation || "";
  },

  getCodeIcon: (code) => {
    return Object.values(codeDetails).find(({ codes }) => codes.includes(code))?.icon as Conditions || 'cloudy'
  },

  formatWind: (wind) => 
     wind < 3 ? "calm" : wind < 30 ? "breeze" : wind < 70 ? "stormy" : "hurricane",
  

  formatWindDirection: (deg) => {
    const directions = ["north", "northeast", "east", "southeast", "south", "southwest", "west", "northwest"];
    return directions[Math.floor((deg + 22.5) / 45) % 8];
  },

}));
