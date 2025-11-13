'use client';

import OpenMenuBtn from '../Menu/OpenMenuBtn';

export default function Navbar() {
  return (
    <div className="absolute right-24 bottom-10 z-10 flex flex-col">
      <OpenMenuBtn variant="icon" />
    </div>
  );
}
