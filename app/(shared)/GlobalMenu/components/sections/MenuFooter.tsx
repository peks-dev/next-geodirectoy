// MenuFooter component for the GlobalMenu

'use client';

import { JSX } from 'react';
import { MENU_CLASSES } from '../../constants/menuClasses';

export const MenuFooter = (): JSX.Element => (
  <div>
    <div className={MENU_CLASSES.FOOTER_DIVIDER} />
    <nav className={MENU_CLASSES.FOOTER_NAV}>
      <li>
        <button className={MENU_CLASSES.FOOTER_BUTTON}>condiciones</button>
      </li>
      <li>
        <button className={MENU_CLASSES.FOOTER_BUTTON}>privacidad</button>
      </li>
    </nav>
  </div>
);
