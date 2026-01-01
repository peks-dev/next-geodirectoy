'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Button from '@/app/components/ui/Button';
import SettingsIcon from '@/app/components/ui/svgs/SettingsIcon';
import EditProfileBtn from './EditProfileBtn';
import DeleteAccountBtn from '@/app/(auth)/components/DeleteAccountBtn';

export default function DropdownProfileOptions() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Opciones de perfil"
        aria-expanded={isOpen}
        className="p-2"
      >
        <SettingsIcon />
      </Button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <div className="border-accent-primary absolute right-0 z-50 mt-5 w-[50vw] max-w-96 border-2 p-2 shadow-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -5 }}
              transition={{
                duration: 0.25,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              {/* Scan line holográfico */}
              <motion.div
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{
                  scaleY: [0, 1, 0],
                  opacity: [0, 0.4, 0],
                }}
                transition={{
                  duration: 0.4,
                  times: [0, 0.5, 1],
                  ease: 'easeInOut',
                }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, transparent, var(--color-accent-primary), transparent)',
                  transformOrigin: 'top',
                  pointerEvents: 'none',
                  zIndex: 10,
                }}
              />

              {/* Contenido con stagger */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.1,
                    },
                  },
                }}
                className="bg-background-interactive flex flex-col py-1"
              >
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.25, ease: 'easeOut' },
                    },
                  }}
                >
                  <EditProfileBtn />
                </motion.div>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.25, ease: 'easeOut' },
                    },
                  }}
                >
                  <DeleteAccountBtn />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
