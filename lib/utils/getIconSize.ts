type IconSize = 'xsm' | 'small' | 'md' | 'lg' | 'xl';

export const getIconSizeClass = (size: IconSize) => {
  const sizeMap: Record<IconSize, string> = {
    xsm: 'h-[var(--icon-xsm)] w-[var(--icon-xsm)]',
    small: 'h-[var(--icon-small-size)] w-[var(--icon-small-size)]',
    md: 'h-[var(--icon-md)] w-[var(--icon-md)]',
    lg: 'h-[var(--icon-lg)] w-[var(--icon-lg)]',
    xl: 'h-[var(--icon-xl)] w-[var(--icon-xl)]',
  };
  return sizeMap[size];
};
