'use client';

import OpenMenuBtn from '../Menu/OpenMenuBtn';

export default function Navbar() {
  return (
    <div className="absolute right-3 bottom-20 z-10 flex flex-col">
      <OpenMenuBtn variant="icon" />
    </div>
  );
}
