'use client';
import { ProfileIcon, MapIcon, ThemeIcon, GearIcon } from '../ui/svgs';
import OptionMenu from './OptionMenu';
import Button from '../ui/Button';
import { CornerIcon } from '../ui/svgs';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useGlobalMenuStore } from '@/lib/stores/useGlobalMenuStore';

export default function GlobalMenu() {
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { isMenuOpen, closeMenu } = useGlobalMenuStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = () => {
    closeMenu();
  };

  // No renderizar hasta que esté montado
  if (!mounted || !isMenuOpen) return null;

  const isSystemSync = theme === 'system';
  const themeLabel = `Cambiar a modo ${resolvedTheme === 'dark' ? 'claro' : 'oscuro'}`;

  const toggleTheme = () => {
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  const syncWithSystem = () => {
    setTheme('system');
  };

  const navigateTo = (path: string) => {
    router.push(path);
    handleClose();
  };

  return (
    <div className="menu-overlay fixed inset-0 bottom-0 left-0 z-100 flex h-full w-full flex-col bg-black/50">
      <div className="close-zone w-full grow" onClick={handleClose}></div>
      <div className="menu-wrapper gap-md mt-auto flex w-full max-w-150 flex-col">
        {/* Header */}
        <header className="menu-header bg-dark-secondary border-accent-primary border-t-2">
          <span className="font-heading neon-effect text-light-secondary px-4 py-2 text-lg uppercase">
            menu
          </span>
        </header>

        {/* Contenido principal */}
        <div className="menu-links transparent-container grow p-4">
          <div className="gap-xl relative flex grow flex-col p-4">
            <CornerIcon
              position="top-left"
              size="small"
              className="text-light-primary"
            />
            <CornerIcon
              position="top-right"
              size="small"
              className="text-light-primary"
            />
            <CornerIcon
              position="bottom-left"
              size="small"
              className="text-light-primary"
            />
            <CornerIcon
              position="bottom-right"
              size="small"
              className="text-light-primary"
            />
            {/* Sección Tema */}
            <nav className="before:text-light-primary before:font-heading px-4 before:mb-10 before:block before:text-sm before:uppercase before:content-['tema']">
              <ul className="gap-lg flex flex-col items-center">
                <OptionMenu
                  icon={<ThemeIcon />}
                  label={themeLabel}
                  onClick={toggleTheme}
                />
                <OptionMenu
                  icon={<GearIcon />}
                  label={
                    isSystemSync
                      ? '✓ Sincronizado con sistema'
                      : 'Sincronizar con sistema'
                  }
                  onClick={syncWithSystem}
                  disabled={isSystemSync}
                />
              </ul>
            </nav>

            {/* Sección Navegación */}
            <nav className="before:text-light-primary before:font-heading px-4 before:mb-10 before:block before:text-sm before:uppercase before:content-['navegacion']">
              <ul className="gap-lg flex flex-col items-center">
                <OptionMenu
                  icon={<MapIcon />}
                  label="Explorar mapa"
                  onClick={() => navigateTo('/')}
                />
                <OptionMenu
                  icon={<ProfileIcon />}
                  label="Ver mi perfil"
                  onClick={() => navigateTo('/perfil')}
                />
              </ul>
            </nav>
          </div>

          {/* Footer */}
          <div>
            <div className="divider bg-border-secondary mx-auto mt-20 h-0.5 w-[90%]"></div>
            <nav className="my-5 flex items-center justify-around">
              <li>
                <button className="text-light-primary active:text-accent-primary hover-neon-text cursor-pointer text-xs active:scale-105">
                  condiciones
                </button>
              </li>
              <li>
                <button className="text-light-primary active:text-accent-primary hover-neon-text cursor-pointer text-xs active:scale-105">
                  privacidad
                </button>
              </li>
            </nav>
            <Button onClick={handleClose}>cerrar</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
