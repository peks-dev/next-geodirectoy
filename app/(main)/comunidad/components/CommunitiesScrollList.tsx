'use client';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CardCommunity from '@/comunidad/components/CardCommunity';
import { useCommunitiesProfileStore } from '../../perfil/stores/useCommunitiesProfileStore';
import { Community } from '@/comunidad/types';

gsap.registerPlugin(ScrollTrigger);

interface CommunitiesScrollListProps {
  initialItems: Community[];
}

export default function CommunitiesScrollList({
  initialItems,
}: CommunitiesScrollListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLLIElement | null)[]>([]);

  const { communities, setCommunities } = useCommunitiesProfileStore();

  // SOLUCIÓN: Siempre sincronizar con initialItems
  // Esto permite que el componente refleje cambios del servidor
  useEffect(() => {
    setCommunities(initialItems);
  }, [initialItems, setCommunities]);

  // Efecto de animación - se ejecuta cuando communities cambia
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current;

      cards.forEach((card) => {
        if (!card) return;

        // Entrada
        gsap.fromTo(
          card,
          { scale: 0.5, opacity: 0.5 },
          {
            scale: 1,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              scroller: containerRef.current,
              start: 'top 85%',
              end: 'center center',
              scrub: true,
            },
          }
        );

        // Salida
        gsap.fromTo(
          card,
          { scale: 1, opacity: 1 },
          {
            scale: 0.5,
            opacity: 0.5,
            ease: 'power2.in',
            scrollTrigger: {
              trigger: card,
              scroller: containerRef.current,
              start: 'center center',
              end: 'bottom 15%',
              scrub: true,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [communities]);

  return (
    <div
      ref={containerRef}
      className="border-border relative h-full w-full grow overflow-y-auto border-b-2"
    >
      <ul className="flex flex-col items-center gap-12 py-[10vh]">
        {communities.map((community, index) => (
          <li
            key={`${community.id}-${index}`} // ✅ Key corregida
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            className="flex w-full max-w-[800px] origin-center justify-center will-change-transform"
          >
            <div className="w-full">
              <CardCommunity data={community} isPopup={false} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
