'use client';
import Button from '@/app/components/ui/Button';
import type { Coordinates } from '@/app/types/communityTypes';

const OpenInMaps = ({ lat, lng }: Coordinates) => {
  const handleClick = () => {
    // URI para apps nativas de mapas
    const iosURI = `maps://?q=${lat},${lng}`;
    const androidURI = `geo:0,0?q=${lat},${lng}`;
    const googleURI = `https://www.google.com/maps?q=${lat},${lng}`;

    // Intenta abrir app nativa primero
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      window.location.href = iosURI;
    } else if (/android/i.test(navigator.userAgent)) {
      window.location.href = androidURI;
    } else {
      window.open(googleURI, '_blank');
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="secondary"
      className="bg-background-interactive hover:bg-accent-primary hover:text-dark-primary absolute bottom-5 left-5 z-50"
    >
      Abrir en Mapas
    </Button>
  );
};

export default OpenInMaps;
