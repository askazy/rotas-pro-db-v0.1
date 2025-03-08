/*
  # Esquema inicial do sistema de transporte executivo

  1. Novas Tabelas
    - `profiles`
      - Armazena informações adicionais dos usuários
      - Vinculado à tabela auth.users do Supabase
    - `drivers`
      - Informações específicas dos motoristas
      - Documentos, status, avaliação
    - `vehicles`
      - Cadastro dos veículos da frota
    - `rides`
      - Registro das corridas
      - Status, origem, destino, valores
    - `ride_status_history`
      - Histórico de alterações de status das corridas
    
  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas específicas para cada tipo de usuário
    - Proteção de dados sensíveis
*/

-- Profiles table
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    updated_at timestamptz DEFAULT now(),
    full_name text NOT NULL,
    phone text,
    user_type text NOT NULL CHECK (user_type IN ('admin', 'driver', 'passenger')),
    avatar_url text,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Drivers table
CREATE TABLE public.drivers (
    id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    license_number text NOT NULL,
    license_expiry date NOT NULL,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'suspended')),
    rating numeric(3,2) DEFAULT 5.00 CHECK (rating >= 1 AND rating <= 5),
    total_rides integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all drivers"
    ON public.drivers
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'admin'
        )
    );

CREATE POLICY "Drivers can view their own record"
    ON public.drivers
    FOR SELECT
    USING (auth.uid() = id);

-- Vehicles table
CREATE TABLE public.vehicles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id uuid REFERENCES public.drivers(id) ON DELETE SET NULL,
    model text NOT NULL,
    year integer NOT NULL,
    plate text NOT NULL UNIQUE,
    color text NOT NULL,
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all vehicles"
    ON public.vehicles
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'admin'
        )
    );

CREATE POLICY "Drivers can view their assigned vehicles"
    ON public.vehicles
    FOR SELECT
    USING (driver_id = auth.uid());

-- Rides table
CREATE TABLE public.rides (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    passenger_id uuid REFERENCES public.profiles(id) NOT NULL,
    driver_id uuid REFERENCES public.drivers(id),
    vehicle_id uuid REFERENCES public.vehicles(id),
    pickup_location jsonb NOT NULL,
    dropoff_location jsonb NOT NULL,
    scheduled_time timestamptz NOT NULL,
    status text NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
    price decimal(10,2),
    payment_status text DEFAULT 'pending' 
        CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    passenger_rating numeric(3,2) CHECK (passenger_rating >= 1 AND passenger_rating <= 5),
    driver_rating numeric(3,2) CHECK (driver_rating >= 1 AND driver_rating <= 5),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Passengers can view their own rides"
    ON public.rides
    FOR SELECT
    USING (passenger_id = auth.uid());

CREATE POLICY "Drivers can view their assigned rides"
    ON public.rides
    FOR SELECT
    USING (driver_id = auth.uid());

CREATE POLICY "Admins can view all rides"
    ON public.rides
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'admin'
        )
    );

-- Ride status history
CREATE TABLE public.ride_status_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ride_id uuid REFERENCES public.rides(id) ON DELETE CASCADE NOT NULL,
    status text NOT NULL,
    notes text,
    created_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES public.profiles(id) NOT NULL
);

ALTER TABLE public.ride_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view status history of their rides"
    ON public.ride_status_history
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.rides
            WHERE rides.id = ride_status_history.ride_id
            AND (
                rides.passenger_id = auth.uid()
                OR rides.driver_id = auth.uid()
                OR EXISTS (
                    SELECT 1 FROM public.profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.user_type = 'admin'
                )
            )
        )
    );

-- Funções auxiliares
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, user_type)
    VALUES (new.id, new.raw_user_meta_data->>'full_name', 
            COALESCE(new.raw_user_meta_data->>'user_type', 'passenger'));
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
