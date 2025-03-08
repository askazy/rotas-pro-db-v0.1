// Tipos para o banco de dados Supabase

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  user_type: 'admin' | 'driver' | 'passenger';
  email: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Ride {
  id: string;
  passenger_id: string;
  driver_id: string | null;
  pickup_location: string;
  destination: string;
  pickup_time: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  price: number;
  created_at: string;
  updated_at: string;
}

export interface DriverKey {
  id: string;
  key: string;
  is_used: boolean;
  created_at: string;
  used_by?: string;
}

export interface Rating {
  id: string;
  ride_id: string;
  passenger_id: string;
  driver_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}
