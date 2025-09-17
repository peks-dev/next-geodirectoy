import type { ReactNode, HTMLAttributes } from 'react';

// Definimos los tipos para las props de flexbox
type SpacingScale = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type FlexDirection = 'row' | 'col' | 'row-reverse' | 'col-reverse';
type JustifyContent =
  | 'start'
  | 'end'
  | 'center'
  | 'between'
  | 'around'
  | 'evenly';
type AlignItems = 'start' | 'end' | 'center' | 'baseline' | 'stretch';
type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

// La interfaz de props extiende los atributos estándar de un div
interface FlexBoxProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  direction?: FlexDirection;
  justify?: JustifyContent;
  align?: AlignItems;
  wrap?: FlexWrap;
  gap?: SpacingScale | number;
}

export default function FlexBox({
  children,
  direction = 'row',
  justify = 'start',
  align = 'stretch',
  wrap = 'nowrap',
  gap,
  className = '',
  ...rest
}: FlexBoxProps) {
  // Mapeo de props a clases de Tailwind CSS
  const directionClasses: Record<FlexDirection, string> = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse',
  };

  const justifyClasses: Record<JustifyContent, string> = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const alignClasses: Record<AlignItems, string> = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch',
  };

  const wrapClasses: Record<FlexWrap, string> = {
    nowrap: 'flex-nowrap',
    wrap: 'flex-wrap',
    'wrap-reverse': 'flex-wrap-reverse',
  };

  // --- LÓGICA CORREGIDA PARA EL GAP ---
  let gapClass = '';
  if (gap !== undefined) {
    if (typeof gap === 'number') {
      // Para valores numéricos, usa la escala por defecto de Tailwind: gap-3, gap-4
      gapClass = `gap-${gap}`;
    } else {
      // Para nuestras claves ('xs', 'md'), referencia la variable CSS directamente: gap-(--spacing-md)
      gapClass = `gap-(--spacing-${gap})`;
    }
  }
  // ------------------------------------

  // Combinamos todas las clases
  const combinedClasses = [
    'flex',
    directionClasses[direction],
    justifyClasses[justify],
    alignClasses[align],
    wrapClasses[wrap],
    gapClass,
    className, // Permite añadir clases personalizadas desde fuera
  ]
    .filter(Boolean) // Filtra valores vacíos (como gapClass si no se define)
    .join(' ');

  return (
    <div className={combinedClasses} {...rest}>
      {children}
    </div>
  );
}
