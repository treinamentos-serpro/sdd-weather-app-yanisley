import {
  CircleHelp,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  type LucideIcon,
  Sun,
} from 'lucide-react';

interface WeatherCondition {
  label: string;
  icon: LucideIcon;
}

const conditions: Record<number, WeatherCondition> = {
  0: { label: 'C\u00e9u limpo', icon: Sun },
  1: { label: 'Predominantemente limpo', icon: CloudSun },
  2: { label: 'Parcialmente nublado', icon: CloudSun },
  3: { label: 'Nublado', icon: Cloud },
  45: { label: 'Nevoeiro', icon: CloudFog },
  48: { label: 'Nevoeiro com geada', icon: CloudFog },
  51: { label: 'Garoa leve', icon: CloudDrizzle },
  53: { label: 'Garoa moderada', icon: CloudDrizzle },
  55: { label: 'Garoa intensa', icon: CloudDrizzle },
  56: { label: 'Garoa congelante leve', icon: CloudDrizzle },
  57: { label: 'Garoa congelante intensa', icon: CloudDrizzle },
  61: { label: 'Chuva leve', icon: CloudRain },
  63: { label: 'Chuva moderada', icon: CloudRain },
  65: { label: 'Chuva forte', icon: CloudRain },
  66: { label: 'Chuva congelante leve', icon: CloudRain },
  67: { label: 'Chuva congelante forte', icon: CloudRain },
  71: { label: 'Neve leve', icon: CloudSnow },
  73: { label: 'Neve moderada', icon: CloudSnow },
  75: { label: 'Neve intensa', icon: CloudSnow },
  77: { label: 'Gr\u00e3os de neve', icon: CloudSnow },
  80: { label: 'Pancadas de chuva leves', icon: CloudRain },
  81: { label: 'Pancadas de chuva moderadas', icon: CloudRain },
  82: { label: 'Pancadas de chuva fortes', icon: CloudRain },
  85: { label: 'Pancadas de neve leves', icon: CloudSnow },
  86: { label: 'Pancadas de neve fortes', icon: CloudSnow },
  95: { label: 'Trovoada', icon: CloudLightning },
  96: { label: 'Trovoada com granizo leve', icon: CloudLightning },
  99: { label: 'Trovoada com granizo forte', icon: CloudLightning },
};

export function getWeatherCondition(code: number): WeatherCondition {
  return conditions[code] ?? { label: 'Condi\u00e7\u00e3o desconhecida', icon: CircleHelp };
}
