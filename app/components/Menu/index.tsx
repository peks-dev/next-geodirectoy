'use client';
import { ProfileIcon, MapIcon, ThemeIcon, GearIcon } from '../ui/svgs';
import OptionMenu from './OptionMenu';
import Button from '../ui/Button';
import { CornerIcon } from '../ui/svgs';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState, useRef } from 'react';
import { useGlobalMenuStore } from '@/lib/stores/useGlobalMenuStore';
import { gsap } from 'gsap';

export default function GlobalMenu() {
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { isMenuOpen, closeMenu } = useGlobalMenuStore();
  const [mounted, setMounted] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const menuWrapperRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const themeNavRef = useRef<HTMLElement>(null);
  const navigationNavRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (isMenuOpen) {
      // Animación de apertura
      const tl = gsap.timeline();

      // Fade in overlay
      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );

      // Menu wrapper sube desde abajo
      tl.fromTo(
        menuWrapperRef.current,
        { y: '100%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.4, ease: 'power3.out' },
        '-=0.1'
      );

      // Header aparece con efecto holográfico
      tl.fromTo(
        headerRef.current,
        { opacity: 0, scaleX: 0.8 },
        { opacity: 1, scaleX: 1, duration: 0.3, ease: 'back.out(1.2)' },
        '-=0.2'
      );

      // Opciones aparecen en cascada
      tl.fromTo(
        [themeNavRef.current, navigationNavRef.current],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
        '-=0.2'
      );

      // Footer aparece al final
      tl.fromTo(
        footerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' },
        '-=0.2'
      );
    }
  }, [isMenuOpen, mounted]);

  const handleClose = () => {
    // Animación de cierre
    const tl = gsap.timeline({
      onComplete: closeMenu,
    });

    tl.to(
      [
        footerRef.current,
        navigationNavRef.current,
        themeNavRef.current,
        headerRef.current,
      ],
      { opacity: 0, y: 10, duration: 0.2, stagger: 0.05, ease: 'power2.in' }
    );

    tl.to(
      menuWrapperRef.current,
      { y: '100%', duration: 0.3, ease: 'power3.in' },
      '-=0.1'
    );

    tl.to(
      overlayRef.current,
      { opacity: 0, duration: 0.2, ease: 'power2.in' },
      '-=0.2'
    );
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
    <div
      ref={overlayRef}
      className="menu-overlay fixed inset-0 bottom-0 left-0 z-100 flex h-full w-full flex-col bg-black/50"
    >
      <div className="close-zone w-full grow" onClick={handleClose}></div>
      <div
        ref={menuWrapperRef}
        className="menu-wrapper gap-md mt-auto flex w-full max-w-[600px] flex-col"
      >
        {/* Header */}
        <header
          ref={headerRef}
          className="menu-header bg-dark-secondary border-accent-primary border-t-2"
        >
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
            <nav
              ref={themeNavRef}
              className="before:text-light-primary before:font-heading px-4 before:mb-10 before:block before:text-sm before:uppercase before:content-['tema']"
            >
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
            <nav
              ref={navigationNavRef}
              className="before:text-light-primary before:font-heading px-4 before:mb-10 before:block before:text-sm before:uppercase before:content-['navegacion']"
            >
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
          <div ref={footerRef}>
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
