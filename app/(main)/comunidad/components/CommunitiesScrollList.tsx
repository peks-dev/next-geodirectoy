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
  const isInitializedRef = useRef(false);

  const communities = useCommunitiesProfileStore((state) => state.communities);
  const setCommunities = useCommunitiesProfileStore(
    (state) => state.setCommunities
  );

  //  Inicializar el store en el primer render
  useEffect(() => {
    if (!isInitializedRef.current && initialItems.length > 0) {
      console.log('Inicializando communities:', initialItems);
      setCommunities(initialItems);
      isInitializedRef.current = true;
    }
  }, [initialItems, setCommunities]);

  // Actualizar cuando initialItems cambie (después de la inicialización)
  useEffect(() => {
    if (isInitializedRef.current && initialItems.length > 0) {
      const hasChanged =
        communities.length !== initialItems.length ||
        !initialItems.every(
          (item, index) => item.id === communities[index]?.id
        );

      if (hasChanged) {
        setCommunities(initialItems);
      }
    }
  }, [initialItems, communities, setCommunities]);

  useEffect(() => {
    cardsRef.current = cardsRef.current.slice(0, communities.length);
  }, [communities.length]);

  useEffect(() => {
    if (communities.length === 0) return;

    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.scroller === containerRef.current) {
        trigger.kill();
      }
    });

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { scale: 0.5, opacity: 0.5 },
          {
            scale: 1,
            opacity: 1,
            ease: 'power2.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: card,
              scroller: containerRef.current,
              start: 'top 85%',
              end: 'center center',
              scrub: true,
              onRefresh: (self) => {
                self.animation?.progress(self.progress);
              },
            },
          }
        );

        gsap.fromTo(
          card,
          { scale: 1, opacity: 1 },
          {
            scale: 0.5,
            opacity: 0.5,
            ease: 'power2.in',
            immediateRender: false,
            scrollTrigger: {
              trigger: card,
              scroller: containerRef.current,
              start: 'center center',
              end: 'bottom 15%',
              scrub: true,
              onRefresh: (self) => {
                self.animation?.progress(self.progress);
              },
            },
          }
        );
      });

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        ScrollTrigger.update();
      });
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [communities]);

  return (
    <div
      ref={containerRef}
      className="border-border relative h-full w-full grow overflow-y-auto border-b-2"
    >
      <ul className="flex flex-col items-center gap-12 py-[10vh]">
        {communities.map((community, index) => (
          <li
            key={community.id}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            className="flex w-full max-w-200 origin-center justify-center will-change-transform"
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
