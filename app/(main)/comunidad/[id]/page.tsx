import { getCommunityById } from '@/lib/data/communities';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import ScheduleItem from '@/app/components/community/schedule/ScheduleItem';
import NavigationButton from '@/app/components/ui/Buttons/NavigationButton';
import type { CommunityFullResponse } from '@/app/types/communityTypes';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Página individual de comunidad
 *
 * Muestra toda la información de una comunidad específica.
 */
export default async function CommunityPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch de la comunidad por ID
  const community: CommunityFullResponse | null = await getCommunityById(id);

  // Si no existe, mostrar página 404
  if (!community) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl p-4">
      {/* Header con tipo y nombre */}
      <header className="gap-lg mb-6 flex justify-around">
        <NavigationButton url="/" variant="primary">
          mapa
        </NavigationButton>
        <div className="mb-2 flex items-center gap-2">
          <span className="bg-accent-primary text-dark-primary rounded-full px-3 py-1 text-sm font-medium uppercase">
            {community.type === 'pickup' ? 'Retas' : 'Club'}
          </span>
          {community.is_covered && (
            <span className="rounded-full bg-blue-500 px-2 py-1 text-xs text-white">
              Techado
            </span>
          )}
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-foreground-primary mb-2 text-3xl font-bold">
            {community.name}
          </h1>
          <p className="text-foreground-secondary">{community.description}</p>
        </div>
      </header>

      {/* Galería de imágenes */}
      <section className="mb-6">
        <h2 className="text-foreground-primary mb-3 text-xl font-bold">
          Imágenes
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {community.images.map((imageUrl, index) => (
            <div
              key={index}
              className="border-border relative h-48 w-full overflow-hidden rounded-lg border-2"
            >
              <Image
                src={imageUrl}
                alt={`${community.name} - imagen ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Ubicación */}
      <section className="mb-6">
        <h2 className="text-foreground-primary mb-3 text-xl font-bold">
          Ubicación
        </h2>
        <div className="bg-background-secondary border-border rounded-lg border-2 p-4">
          <p className="text-foreground-primary">
            <span className="font-medium">Ciudad:</span> {community.city}
          </p>
          {community.state && (
            <p className="text-foreground-primary">
              <span className="font-medium">Estado:</span> {community.state}
            </p>
          )}
          <p className="text-foreground-primary">
            <span className="font-medium">País:</span> {community.country}
          </p>
          <p className="text-foreground-secondary mt-2 text-sm">
            Coordenadas: {community.lat.toFixed(6)}, {community.lng.toFixed(6)}
          </p>
        </div>
      </section>

      {/* Características */}
      <section className="mb-6">
        <h2 className="text-foreground-primary mb-3 text-xl font-bold">
          Características
        </h2>
        <div className="bg-background-secondary border-border space-y-2 rounded-lg border-2 p-4">
          <p className="text-foreground-primary">
            <span className="font-medium">Tipo de piso:</span>{' '}
            {getFloorTypeLabel(community.floor_type)}
          </p>
          {community.age_group && (
            <p className="text-foreground-primary">
              <span className="font-medium">Grupo de edad:</span>{' '}
              {getAgeGroupLabel(community.age_group)}
            </p>
          )}
        </div>
      </section>

      {/* Servicios */}
      <section className="mb-6">
        <h2 className="text-foreground-primary mb-3 text-xl font-bold">
          Servicios
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <ServiceCard
            label="Transporte"
            available={community.services.transport}
          />
          <ServiceCard label="Tienda" available={community.services.store} />
          <ServiceCard label="WiFi" available={community.services.wifi} />
          <ServiceCard label="Baño" available={community.services.bathroom} />
        </div>
      </section>

      {/* Horarios */}
      <section className="mb-6">
        <h2 className="text-foreground-primary mb-3 text-xl font-bold">
          Horarios
        </h2>
        <ul className="space-y-2">
          {community.schedule.map((scheduleItem, index) => (
            <ScheduleItem key={index} data={scheduleItem} />
          ))}
        </ul>
      </section>

      {/* Categorías (solo para clubs) */}
      {community.categories && community.categories.length > 0 && (
        <section className="mb-6">
          <h2 className="text-foreground-primary mb-3 text-xl font-bold">
            Categorías
          </h2>
          <div className="space-y-3">
            {community.categories.map((category, index) => (
              <div
                key={index}
                className="bg-background-secondary border-border rounded-lg border-2 p-4"
              >
                <p className="text-foreground-primary mb-1 font-medium">
                  {category.category}
                </p>
                <p className="text-foreground-secondary text-sm">
                  Edad: {category.min_age}
                  {category.max_age ? ` - ${category.max_age}` : '+'} años
                </p>
                <p className="text-foreground-secondary text-sm">
                  Géneros: {category.genders.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reseñas */}
      <section className="mb-6">
        <h2 className="text-foreground-primary mb-3 text-xl font-bold">
          Reseñas
        </h2>
        <div className="bg-background-secondary border-border rounded-lg border-2 p-4">
          <div className="flex items-center gap-2">
            <span className="text-accent-primary text-2xl font-bold">
              {community.average_rating.toFixed(1)}
            </span>
            <span className="text-foreground-secondary">
              / 5.0 ({community.total_reviews}{' '}
              {community.total_reviews === 1 ? 'reseña' : 'reseñas'})
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================
// COMPONENTES AUXILIARES
// ============================================

function ServiceCard({
  label,
  available,
}: {
  label: string;
  available: boolean;
}) {
  return (
    <div
      className={`rounded-lg border-2 p-3 text-center ${
        available
          ? 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400'
          : 'border-gray-500 bg-gray-500/10 text-gray-600 dark:text-gray-400'
      }`}
    >
      <p className="font-medium">{label}</p>
      <p className="text-sm">
        {available ? '✓ Disponible' : '✗ No disponible'}
      </p>
    </div>
  );
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function getFloorTypeLabel(floorType: string): string {
  const labels: Record<string, string> = {
    cement: 'Cemento',
    parquet: 'Parquet',
    asphalt: 'Asfalto',
    synthetic: 'Sintético',
  };
  return labels[floorType] || floorType;
}

function getAgeGroupLabel(ageGroup: string): string {
  const labels: Record<string, string> = {
    teens: 'Adolescentes',
    young_adults: 'Adultos jóvenes',
    veterans: 'Veteranos',
    mixed: 'Mixto',
  };
  return labels[ageGroup] || ageGroup;
}
