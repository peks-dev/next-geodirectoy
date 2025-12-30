// MenuHeader component for the GlobalMenu

'use client';

import { JSX } from 'react';
import { MENU_CLASSES } from '../../constants/menuClasses';

export const MenuHeader = (): JSX.Element => (
  <header className={MENU_CLASSES.HEADER}>
    <span className={MENU_CLASSES.TITLE}>menu</span>
  </header>
);
