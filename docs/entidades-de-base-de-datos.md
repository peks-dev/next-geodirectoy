# Entidades de Base de Datos

## 1. Entidad: Communities

Tabla unificada para canchas tipo "reta" y "club" con campos específicos opcionales según el tipo.  
| Campo | Tipo | Descripción | Ejemplo | Restricciones |
|:----------------|:---------------------------------------------------------------------|:--------------------------------------------------------------|:---------------------------------------|:----------------------------|
| **id** | `UUID PRIMARY KEY DEFAULT gen\_random\_uuid()` | Identificador único de la comunidad | `550e8400-e29b-41d4-a716-446655440000` | NOT NULL, PK |
| **type** | `community\_type ENUM ('reta', 'club')` | Tipo de comunidad | `'reta'` o `'club'` | NOT NULL |
| **name** | `TEXT NOT NULL` | Nombre de la comunidad/cancha | `"Cancha Parque Hundido"` | NOT NULL, máx. 100 chars |
| **description** | `TEXT` | Descripción opcional de la comunidad | `"Reta casual todos los sábados"` | máx. 500 chars |
| **location** | `GEOGRAPHY(POINT, 4326) NOT NULL` | Ubicación geoespacial (PostGIS) | `ST\_Point(-99.1332, 19.4326)` | NOT NULL, PostGIS Point |
| **images** | `JSONB NOT NULL` | URLs de imágenes (mínimo 2) | `["image1.jpg", "image2.jpg"]` | NOT NULL, mín. 2 elementos |
| **floor_type** | `floor\_type\_enum ('cement', 'parquet', 'asphalt', 'synthetic')` | Tipo de suelo de la cancha | `'cement'` | NOT NULL |
| **is_covered** | `BOOLEAN NOT NULL DEFAULT false` | Si la cancha está techada | `true` | NOT NULL, default false |
| **schedule** | `JSONB NOT NULL` | Horarios (común para retas y clubs) | Ver ejemplo abajo | NOT NULL |
| **services** | `JSONB NOT NULL` | Servicios disponibles (común para retas y clubs) | Ver ejemplo abajo | NOT NULL |
| **age_group** | `age\_group\_enum ('adolescentes', 'jovenes', 'veteranos', 'mixto')` | Grupo de edad predominante (solo para retas, NULL para clubs) | `'jovenes'` | NULL para clubs |
| **categories** | `JSONB` | Categorías del club (solo para clubs, NULL para retas) | Ver ejemplo abajo | NULL para retas |
| **user_id** | `UUID REFERENCES auth.users(id) ON DELETE SET NULL` | Usuario que contribuyó la comunidad | `550e8400-e29b-41d4-a716-446655440001` | FK a auth.users |
| **created_at** | `TIMESTAMPTZ DEFAULT NOW()` | Fecha de creación | `2024-03-15T10:30:00Z` | NOT NULL, auto |
| **updated_at** | `TIMESTAMPTZ DEFAULT NOW()` | Fecha de última actualización | `2024-03-20T14:45:00Z` | NOT NULL, auto |

### Ejemplos de Campos JSONB:

### Schedule (común para retas y clubs):

```
[
  {
    "days": ["monday", "wednesday", "friday"],
    "time": {"start": "18:00", "end": "20:00"}
  },
  {
    "days": ["saturday", "sunday"],
    "time": {"start": "07:00", "end": "09:00"}
  }
]


```

### Services (común para retas y clubs):

```
{
  "internet": true,
  "shop": true,
  "bathroom": false,
  "transport": false,
}


```

### Categories (solo para type = 'club'):

```
{
  "age_groups": [
    {
      "category": "infantil",
      "min_age": 8,
      "max_age": 12,
      "genders": ["male", "female", "mixed"]
    },
    {
      "category": "juvenil",
      "min_age": 13,
      "max_age": 17,
      "genders": ["male", "female"]
    },
    {
      "category": "adult",
      "min_age": 18,
      "max_age": null,
      "genders": ["male"]
    }
  ]
}


```

### Ejemplos de Uso PostGIS:

### Insertar ubicación:

```
INSERT INTO communities (name, type, location, ...)
VALUES ('Cancha Parque Hundido', 'reta', ST_Point(-99.1332, 19.4326), ...);


```

### Consultar por distancia (5km):

```
SELECT name, ST_Distance(location, ST_Point(-99.1332, 19.4326)::geography) as distance_meters
FROM communities
WHERE ST_DWithin(location, ST_Point(-99.1332, 19.4326)::geography, 5000)
ORDER BY distance_meters;


```

### Reglas de Negocio:

- **Campos específicos por tipo**: Si `type = 'reta'` entonces `age\_group` es requerido y `categories` es NULL
- **Campos específicos por tipo**: Si `type = 'club'` entonces `categories` es requerido y `age\_group` es NULL
- **Imágenes**: Mínimo 2, máximo 4 imágenes por comunidad
- **Usuarios autenticados únicamente**: Solo usuarios logueados pueden registrar comunidades
  ***

## 2. Entidad: Profiles

Información extendida del usuario, complementa `auth.users` de Supabase.  
| Campo | Tipo | Descripción | Ejemplo | Restricciones |
|:----------------|:---------------------------------------------------------------|:-------------------------------------------|:---------------------------------------|:--------------------|
| **id** | `UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE` | ID del usuario (mismo que auth.users) | `550e8400-e29b-41d4-a716-446655440000` | PK, FK a auth.users |
| **name** | `TEXT` | Nombre del usuario (opcional inicialmente) | `"Juan Pérez"` | máx. 100 chars |
| **avatar_url** | `TEXT` | URL del avatar en Supabase Storage | `"avatars/user123.jpg"` | URL válida |
| **created_at** | `TIMESTAMPTZ DEFAULT NOW()` | Fecha de creación del perfil | `2024-03-15T10:30:00Z` | NOT NULL, auto |
| **updated_at** | `TIMESTAMPTZ DEFAULT NOW()` | Fecha de última actualización | `2024-03-20T14:45:00Z` | NOT NULL, auto |

### Reglas de Negocio:

- **Relación 1:1**: Un usuario = un perfil exactamente
- **Creación automática**: Se crea automáticamente al registrarse (trigger)
- **Avatar**: Almacenado en Supabase Storage, máximo 2MB
  ***

## 3. Entidad: Email Preferences

Preferencias de notificaciones por correo para cada usuario.  
| Campo | Tipo | Descripción | Ejemplo | Restricciones |
|:-------------------------|:---------------------------------------------------------------|:--------------------------------------------|:---------------------------------------|:------------------------|
| **user_id** | `UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE` | ID del usuario | `550e8400-e29b-41d4-a716-446655440000` | PK, FK a auth.users |
| **notif_contributions** | `BOOLEAN NOT NULL DEFAULT true` | Recibir updates de contribuciones | `true` | NOT NULL, default true |
| **notif_reviews** | `BOOLEAN NOT NULL DEFAULT true` | Notificar cuando valoren sus contribuciones | `false` | NOT NULL, default true |
| **notif_newsletter** | `BOOLEAN NOT NULL DEFAULT false` | Recibir newsletter (opt-in explícito) | `true` | NOT NULL, default false |
| **created_at** | `TIMESTAMPTZ DEFAULT NOW()` | Fecha de creación de preferencias | `2024-03-15T10:30:00Z` | NOT NULL, auto |
| **updated_at** | `TIMESTAMPTZ DEFAULT NOW()` | Fecha de última actualización | `2024-03-20T14:45:00Z` | NOT NULL, auto |

### Reglas de Negocio:

- **Creación automática**: Se crea automáticamente al registrarse con defaults
- **Newsletter opt-in**: Por defecto false, usuario debe activar explícitamente
- **Respeto absoluto**: Toda comunicación por email debe verificar estas preferencias
  ***

## 4. Entidad: Reviews

Valoraciones de usuarios sobre comunidades/canchas.  
| Campo | Tipo | Descripción | Ejemplo | Restricciones |
|:------------------|:-------------------------------------------------------------|:-------------------------------------------|:---------------------------------------|:----------------|
| **id** | `UUID PRIMARY KEY DEFAULT gen\_random\_uuid()` | Identificador único de la review | `550e8400-e29b-41d4-a716-446655440000` | PK |
| **community_id** | `UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE` | Referencia a la comunidad valorada | `550e8400-e29b-41d4-a716-446655440001` | NOT NULL, FK |
| **user_id** | `UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE` | Usuario que hizo la valoración | `550e8400-e29b-41d4-a716-446655440002` | NOT NULL, FK |
| **rating** | `INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5)` | Puntaje del 1 al 5 | `4` | NOT NULL, 1-5 |
| **comment** | `TEXT CHECK (LENGTH(comment) <= 500)` | Comentario opcional (máx. 500 caracteres) | `"Excelente cancha, buen ambiente"` | máx. 500 chars |
| **created_at** | `TIMESTAMPTZ DEFAULT NOW()` | Fecha de creación de la review | `2024-03-15T10:30:00Z` | NOT NULL, auto |
| **updated_at** | `TIMESTAMPTZ DEFAULT NOW()` | Fecha de última actualización | `2024-03-20T14:45:00Z` | NOT NULL, auto |

### Constraints Únicos:

```
-- Un usuario solo puede hacer una review por comunidad (implementado en DB y frontend)
UNIQUE(community_id, user_id)


```

### Reglas de Negocio:

- **Una review por usuario por comunidad**: Constraint único evita duplicados
- **Usuarios autenticados únicamente**: Solo usuarios logueados pueden valorar
- **Edición permitida**: Los usuarios pueden editar su propia review
  ***

## ENUMs Requeridos

```
-- Habilitar PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Tipos de comunidad
CREATE TYPE community_type AS ENUM ('reta', 'club');

-- Tipos de suelo
CREATE TYPE floor_type_enum AS ENUM ('cement', 'parquet', 'asphalt', 'synthetic');

-- Grupos de edad
CREATE TYPE age_group_enum AS ENUM ('adolescentes', 'jovenes', 'veteranos', 'mixto');


```

---

## Índices Recomendados

```
-- Para búsquedas geoespaciales (PostGIS spatial index)
CREATE INDEX idx_communities_location_gist ON communities USING GIST (location);

-- Para filtros por tipo
CREATE INDEX idx_communities_type ON communities (type);

-- Para filtros por grupo de edad
CREATE INDEX idx_communities_age_group ON communities (age_group) WHERE age_group IS NOT NULL;

-- Para búsquedas de reviews por comunidad
CREATE INDEX idx_reviews_community_id ON reviews (community_id);

-- Para búsquedas de reviews por usuario
CREATE INDEX idx_reviews_user_id ON reviews (user_id);

-- Para búsquedas combinadas (comunidad + fecha)
CREATE INDEX idx_reviews_community_created ON reviews (community_id, created_at DESC);


```

---

## Triggers Necesarios

```
-- Auto-actualizar updated_at en todas las tablas
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas
CREATE TRIGGER communities_updated_at BEFORE UPDATE ON communities FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER email_preferences_updated_at BEFORE UPDATE ON email_preferences FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Crear profile automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);

  INSERT INTO public.email_preferences (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


```

---

## Consultas PostGIS Útiles

### Búsqueda por Radio (5km):

```
SELECT
  id,
  name,
  type,
  ST_Distance(location, ST_Point(-99.1332, 19.4326)::geography) / 1000 as distance_km
FROM communities
WHERE ST_DWithin(location, ST_Point(-99.1332, 19.4326)::geography, 5000)
ORDER BY distance_km;


```

### Obtener Coordenadas de una Comunidad:

```
SELECT
  name,
  ST_Y(location::geometry) as latitude,
  ST_X(location::geometry) as longitude
FROM communities
WHERE id = 'uuid-de-comunidad';


```

### Búsqueda Dentro de un Área (Bounding Box):

```
SELECT * FROM communities
WHERE ST_Within(
  location::geometry,
  ST_MakeEnvelope(-99.2, 19.3, -99.0, 19.5, 4326)
);


```

### Comunidades Más Cercanas:

```
SELECT
  name,
  type,
  age_group,
  ST_Distance(location, ST_Point($1, $2)::geography) as distance
FROM communities
ORDER BY location <-> ST_Point($1, $2)::geography
LIMIT 10;


```

---

## Consideraciones de Rendimiento PostGIS

1. **GIST Index**: El índice GIST en `location` es crucial para consultas espaciales rápidas
2. **Geography vs Geometry**: Usamos `GEOGRAPHY` para cálculos precisos de distancia en metros
3. **SRID 4326**: Sistema de coordenadas estándar (WGS84) compatible con GPS
4. **Operador de Distancia**: `<->` es más rápido para búsquedas de "k vecinos más cercanos"

---

## Validaciones Adicionales

### En la Aplicación (Zod):

```
const communitySchema = z.object({
  location: z.object({
    lat: z.number().min(14.5).max(32.7), // Rango válido para México
    lng: z.number().min(-118.4).max(-86.7)
  }),
  // Validación condicional por tipo
}).superRefine((data, ctx) => {
  if (data.type === 'reta' && !data.age_group) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "age_group es requerido para retas",
      path: ['age_group']
    });
  }
  if (data.type === 'club' && !data.categories) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "categories es requerido para clubs",
      path: ['categories']
    });
  }
});


```

---

## Consideraciones de Seguridad

1. **Row Level Security (RLS)**: Implementar políticas de RLS en Supabase
2. **Validación dual**: Constraints en DB + validación en frontend/backend
3. **Sanitización**: Todos los inputs de texto deben ser sanitizados
4. **Rate limiting**: Prevenir spam de reviews y contribuciones
5. **Moderación IA**: Contenido validado antes de publicación
6. **PostGIS Security**: Validar coordenadas están dentro de rangos esperados

---

## Notas de Implementación

1. **PostGIS Performance**: Consultas geoespaciales serán extremadamente rápidas
2. **Migración futura**: Fácil agregar más funcionalidades geoespaciales (áreas de influencia, rutas, etc.)
3. **Escalabilidad**: Diseño preparado para millones de ubicaciones
4. **Compatibilidad**: PostGIS es compatible con todas las bibliotecas de mapas (Leaflet, Google Maps, etc.)
5. **Age Groups**: Sistema simple pero extensible para filtrar retas por edad
