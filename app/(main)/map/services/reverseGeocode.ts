export interface LocationData {
  city: string | null;
  state: string | null;
  country: string | null;
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<LocationData> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

  try {
    // La política de Nominatim requiere un User-Agent descriptivo.
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Basket-Places/1.0 (mail@basket-places.website)', // Reemplaza esto con info de tu app
      },
    });

    if (!response.ok) {
      throw new Error(`Error de Nominatim: ${response.statusText}`);
    }

    const data = await response.json();
    const address = data.address;

    // Nominatim puede devolver 'town', 'village' o 'city'. Usamos el que esté disponible.
    const city = address.city || address.town || address.village || null;
    const state = address.state || null;
    const country = address.country || null;

    return { city, state, country };
  } catch (error) {
    return {
      city: null,
      state: null,
      country: null,
    };
  }
}
