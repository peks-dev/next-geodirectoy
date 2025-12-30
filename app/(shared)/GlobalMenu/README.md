# GlobalMenu Component

Estructura refactorizada del componente GlobalMenu para mejorar la mantenibilidad y legibilidad del código.

## Estructura de Directorios

```
GlobalMenu/
├── index.tsx                 # Componente principal
├── MenuContent.tsx           # Contenido del menú
├── components/               # Componentes UI reutilizables
│   ├── MenuOpenButton.tsx    # Botón de apertura
│   ├── OptionMenu.tsx        # Elemento individual del menú
│   ├── sections/             # Secciones del menú
│   │   ├── MenuHeader.tsx    # Encabezado
│   │   ├── MenuFooter.tsx    # Pie de página
│   │   ├── ThemeSection.tsx  # Controles de tema
│   │   ├── NavigationSection.tsx # Navegación
│   │   └── index.ts         # Barrel file
│   └── index.ts             # Barrel file
├── hooks/                    # Lógica y estado
│   ├── useGlobalMenu.ts      # Hook principal
│   ├── useThemeControls.ts   # Control de tema
│   ├── useMenuNavigation.ts  # Navegación
│   └── useMenuKeyboard.ts    # Eventos de teclado
├── constants/                # Constantes y configuración
│   ├── menuConstants.ts
│   └── menuClasses.ts
└── utils/                    # Funciones utilitarias
    └── menuUtils.ts
```

## Responsabilidades por Archivo

### Componente Principal (`index.tsx`)

- Entry point del componente
- Renderizado condicional (montado)
- Portal a `document.body`
- Consume el hook principal

### Hook Principal (`hooks/useGlobalMenu.ts`)

- Estado del menú (abierto/cerrado)
- Coordinación entre hooks
- Lógica de toggle y cierre
- Integración con stores de Zustand

### Hooks Específicos

- **`useThemeControls.ts`**: Control de tema (light/dark/system)
- **`useMenuNavigation.ts`**: Navegación entre rutas
- **`useMenuKeyboard.ts`**: Manejo de eventos de teclado (Escape)

### Componentes UI

- **`MenuHeader.tsx`**: Encabezado del menú
- **`MenuOpenButton.tsx`**: Botón de apertura/cierre
- **`OptionMenu.tsx`**: Elemento individual del menú

### Secciones

- **`ThemeSection.tsx`**: Controles de tema
- **`NavigationSection.tsx`**: Enlaces de navegación
- **`MenuFooter.tsx`**: Enlaces legales

### Constantes y Utilidades

- **`menuConstants.ts`**: Rutas, etiquetas, posiciones
- **`menuClasses.ts`**: Clases CSS
- **`menuUtils.ts`**: Funciones helper

## Beneficios de la Refactorización

1. **Separación de responsabilidades**: Cada archivo tiene un propósito claro
2. **Reutilización**: Hooks y componentes pueden ser reutilizados
3. **Mantenibilidad**: Código más fácil de encontrar y modificar
4. **Testabilidad**: Componentes más pequeños son más fáciles de probar
5. **Escalabilidad**: Nuevas secciones o funcionalidades son fáciles de añadir

## Uso

```tsx
import GlobalMenu from '@/app/components/GlobalMenu';

// En tu layout o página
<GlobalMenu />;
```

## Próximos Pasos

- [ ] Añadir tests unitarios para cada hook
- [ ] Añadir tests de integración para el componente principal
- [ ] Documentar tipos y interfaces
- [ ] Añadir storybook stories
