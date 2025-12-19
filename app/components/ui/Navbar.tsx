'use client';

import OpenMenuBtn from '../Menu/OpenMenuBtn';
import Headless from '@/app/(shared)/notifications/components/baseToast';

export default function Navbar() {
  return (
    <div className="absolute right-24 bottom-6 z-10 flex flex-col">
      <OpenMenuBtn variant="primary" />
      <Headless />
    </div>
  );
}
