import {
  TransportIcon,
  BathroomIcon,
  WifiIcon,
  StoreIcon,
} from '@/app/components/ui/svgs/';

import type { Service } from '@/comunidad/types';
import ServiceItem from '@/app/components/ui/ServiceBadge';

interface Props {
  serviceStatus: Service;
}

export default function AvailableServices({ serviceStatus }: Props) {
  const services = [
    {
      icon: <TransportIcon />,
      available: serviceStatus.transport,
      label: 'transporte',
    },
    {
      icon: <BathroomIcon />,
      available: serviceStatus.bathroom,
      label: 'baño',
    },
    {
      icon: <WifiIcon />,
      available: serviceStatus.wifi,
      label: 'wifi',
    },
    {
      icon: <StoreIcon />,
      available: serviceStatus.store,
      label: 'tienda',
    },
  ];

  return (
    <div className="flex grow flex-col items-stretch justify-center">
      <ul className="item-center flex justify-around">
        {services.map((service) => (
          <ServiceItem key={service.label} {...service} />
        ))}
      </ul>
    </div>
  );
}
