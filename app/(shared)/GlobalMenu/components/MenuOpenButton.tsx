// MenuOpenButton component for the GlobalMenu

'use client';

import { JSX } from 'react';
import IconBox from '@/app/components/ui/IconBox';
import { ArrowUpIcon } from '@/app/components/ui/svgs';
import { MENU_CLASSES } from '../constants/menuClasses';

interface MenuOpenButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const MenuOpenButton = ({
  isOpen,
  onClick,
}: MenuOpenButtonProps): JSX.Element => (
  <div className={MENU_CLASSES.OPEN_BUTTON_CONTAINER}>
    <button
      className={MENU_CLASSES.OPEN_BUTTON}
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <IconBox
        icon={<ArrowUpIcon />}
        size="md"
        className={MENU_CLASSES.ARROW_ICON(isOpen)}
      />
    </button>
  </div>
);
