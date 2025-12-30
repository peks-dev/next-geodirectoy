// CSS classes for the GlobalMenu component

export const MENU_CLASSES = {
  CLOSE_ZONE: 'close-zone w-full grow',
  WRAPPER: 'menu-wrapper relative z-20 gap-md flex w-full max-w-250 flex-col',
  OVERLAY: 'fixed z-10 top-0 left-0 w-full h-full',
  HEADER: 'menu-header bg-dark-secondary border-accent-primary border-t-2',
  TITLE:
    'font-heading neon-effect text-light-secondary px-4 py-2 text-lg uppercase',
  CONTENT: 'menu-links transparent-container grow p-4',
  CONTENT_WRAPPER: 'gap-xl relative flex grow flex-col p-4',
  CORNER_ICON: 'text-light-primary',
  SECTION_NAV:
    'before:text-light-primary before:font-heading px-4 before:mb-10 before:block before:text-sm before:uppercase',
  SECTION_LIST: 'gap-lg flex flex-col items-center',
  SECTION_TITLE: 'font-heading neon-effect text-light-secondary uppercase mb-5',
  FOOTER_DIVIDER: 'divider bg-border-secondary mx-auto mt-20 h-1 w-[90%]',
  FOOTER_NAV: 'my-5 flex items-center justify-around',
  FOOTER_BUTTON:
    'text-light-primary active:text-accent-primary hover-neon-text cursor-pointer text-xs active:scale-105',
  // New classes for tab-style menu
  OPEN_BUTTON_CONTAINER:
    'fixed z-40 bottom-0 left-0 w-full h-10 flex justify-center',
  OPEN_BUTTON:
    'bg-accent-primary w-full max-w-250 flex items-center justify-center cursor-pointer hover-neon transition-all duration-200',
  ARROW_ICON: (isOpen: boolean) =>
    `text-dark-primary  ${isOpen ? 'rotate-180' : ''} transition-transform duration-200`,
  MENU_CONTAINER: (isOpen: boolean) =>
    `fixed inset-0 z-39 flex flex-col items-center justify-end pb-10 ${
      isOpen ? 'translate-y-0 ' : 'translate-y-[calc(100%-0px)] '
    }`,
  // Clases para gestos de arrastre
  WRAPPER_DRAGGABLE:
    'menu-wrapper relative z-20 gap-md flex w-full max-w-250 flex-col cursor-grab',
  MENU_DRAGGING: 'menu-dragging',
  MENU_GRABBING: 'cursor-grabbing',
} as const;
