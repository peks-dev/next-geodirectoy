import React from 'react';

interface ServiceItemProps {
  icon: React.ReactNode;
  available: boolean;
  label: string;
}

export default function ServiceItem({
  icon,
  available,
  label,
}: ServiceItemProps) {
  return (
    <li
      className={`text-light-4 ${available ? 'neon-effect text-light-tertiary' : 'text-light-4'} flex items-center justify-center p-2 sm:p-4`}
      aria-label={available ? `${label} disponible` : `${label} no disponible`}
      title={available ? `${label} disponible` : `${label} no disponible`}
    >
      <div className="flex w-full flex-col flex-wrap items-center justify-center gap-2 sm:gap-4">
        <div className="flex justify-end">
          <figure className="h-(--icon-lg) w-(--icon-lg)">{icon}</figure>
        </div>
        <div className="flex-1">
          <div className="flex">
            <p
              className={`font-heading text-center uppercase ${available ? 'text-light-tertiary' : 'text-light-4'} text-5x1`}
            >
              {label}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}
