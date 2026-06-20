export interface GeoResult {
  lat: number
  lon: number
  displayName: string
}

export async function geocodeCity(city: string, apiKey: string): Promise<GeoResult | null> {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) return null
  const data = await res.json()
  if (!Array.isArray(data) || data.length === 0) return null
  const { lat, lon, local_names, name } = data[0]
  return { lat, lon, displayName: local_names?.ja ?? name }
}
