# Configuración supabase

---

## **Habilitar PostGIS y Crear ENUMs**

```
-- Habilitar extensión PostGIS para funcionalidades geoespaciales
CREATE EXTENSION IF NOT EXISTS postgis;

-- Tipos de comunidad
CREATE TYPE community_type AS ENUM ('pickup', 'club');

-- Tipos de suelo
CREATE TYPE floor_type_enum AS ENUM ('cement', 'parquet', 'asphalt', 'synthetic');

-- Grupos de edad (solo para pickups)
CREATE TYPE age_group_enum AS ENUM ('teens', 'young_adults', 'veterans', 'mixed');
```

## **Crear Tabla Communities**

```
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type community_type NOT NULL,
  name TEXT NOT NULL CHECK (LENGTH(name) <= 100),
  description TEXT CHECK (LENGTH(description) <= 500),
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  floor_type floor_type_enum NOT NULL,
  is_covered BOOLEAN NOT NULL DEFAULT false,
  schedule JSONB NOT NULL DEFAULT '[]'::jsonb,
  services JSONB NOT NULL DEFAULT '{}'::jsonb,
  age_group age_group_enum, -- NULL para clubs
  categories JSONB, -- NULL para pickups
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  average_rating DECIMAL(3,2) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints para asegurar integridad por tipo
  CONSTRAINT communities_pickup_check
    CHECK (type != 'pickup' OR (age_group IS NOT NULL AND categories IS NULL)),
  CONSTRAINT communities_club_check
    CHECK (type != 'club' OR (categories IS NOT NULL AND age_group IS NULL)),
  CONSTRAINT communities_images_check
    CHECK (jsonb_array_length(images) >= 2 AND jsonb_array_length(images) <= 4)
);
```

## **Crear Tabla Profiles**

```
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT CHECK (LENGTH(name) <= 100),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## **Crear Tabla Reviews**

```
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT CHECK (LENGTH(comment) <= 500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Un usuario solo puede hacer una review por comunidad
  UNIQUE(community_id, user_id)
);
```

## **Crear Índices para Performance**

```
-- Índice geoespacial para búsquedas por ubicación (CRÍTICO para PostGIS)
CREATE INDEX idx_communities_location_gist
ON communities USING GIST (location);

-- Índice para filtros por tipo
CREATE INDEX idx_communities_type
ON communities (type);

-- Índice para filtros por grupo de edad en pickups
CREATE INDEX idx_communities_age_group
ON communities (age_group) WHERE age_group IS NOT NULL;

-- Índice para rating promedio (ordenamiento)
CREATE INDEX idx_communities_rating
ON communities (average_rating DESC);

-- Índice para búsquedas por tipo de suelo
CREATE INDEX idx_communities_floor_type
ON communities (floor_type);

-- Índices para reviews
CREATE INDEX idx_reviews_community_id
ON reviews (community_id);

CREATE INDEX idx_reviews_user_id
ON reviews (user_id);

-- Índice compuesto para reviews por comunidad ordenadas por fecha
CREATE INDEX idx_reviews_community_created
ON reviews (community_id, created_at DESC);
```

## **Crear Función para Auto-actualizar updated_at**

```
-- Función para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas
CREATE TRIGGER communities_updated_at
  BEFORE UPDATE ON communities
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
```

## **Crear Trigger para Auto-crear Profile**

```
-- Crear profile automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que se ejecuta cuando se crea un usuario
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## **Crear Función para Actualizar Rating Promedio**

```
-- Función para recalcular rating promedio cuando se agrega/modifica/elimina una review
CREATE OR REPLACE FUNCTION update_community_rating()
RETURNS TRIGGER AS $$
DECLARE
  community_uuid UUID;
BEGIN
  -- Determinar qué comunidad actualizar
  IF TG_OP = 'DELETE' THEN
    community_uuid := OLD.community_id;
  ELSE
    community_uuid := NEW.community_id;
  END IF;

  -- Actualizar average_rating y total_reviews
  UPDATE communities
  SET
    average_rating = COALESCE((
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM reviews
      WHERE community_id = community_uuid
    ), 0),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews
      WHERE community_id = community_uuid
    )
  WHERE id = community_uuid;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a reviews
CREATE TRIGGER update_community_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_community_rating();
```

## **Configurar Row Level Security (RLS)**

```
-- Habilitar RLS en todas las tablas
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Políticas para COMMUNITIES
-- Todos pueden ver communities
CREATE POLICY "Communities are viewable by everyone" ON communities
  FOR SELECT USING (true);

-- Solo usuarios autenticados pueden crear communities
CREATE POLICY "Users can create communities" ON communities
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Solo el creador puede actualizar su community
CREATE POLICY "Users can update own communities" ON communities
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para PROFILES
-- Usuarios pueden ver todos los perfiles
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- Usuarios solo pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para REVIEWS
-- Todos pueden ver reviews
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

-- Solo usuarios autenticados pueden crear reviews
CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Solo el autor puede actualizar/eliminar su review
CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);
```

## **Configurar Storage Bucket para Imágene**s

```
-- Crear bucket para imágenes de canchas
INSERT INTO storage.buckets (id, name, public)
VALUES ('community-images', 'community-images', true);

-- Política para subir imágenes (solo usuarios autenticados)
CREATE POLICY "Users can upload community images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'community-images'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Política para ver imágenes (público)
CREATE POLICY "Community images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'community-images');

-- Política para actualizar imágenes (solo el propietario)
CREATE POLICY "Users can update own images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'community-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Política para eliminar imágenes (solo el propietario)
CREATE POLICY "Users can delete own images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'community-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

## **Configurar Avatars Bucket para Imágene**s

```
-- Crear bucket para avatares de usuarios
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Política para subir avatares (solo usuarios autenticados pueden subir su propio avatar)
CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Política para ver avatares (público)
CREATE POLICY "Avatars are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Política para actualizar avatares (solo el propietario)
CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Política para eliminar avatares (solo el propietario)
CREATE POLICY "Users can delete own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```
