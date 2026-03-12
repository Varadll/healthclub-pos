export type UserRole = "owner" | "manager" | "trainer";
export type MembershipType = "10-day" | "30-day";
export type MembershipStatus = "active" | "expired" | "pending";
export type Gender = "male" | "female" | "other";

export interface Database {
  public: {
    Tables: {
      clubs: {
        Row: Club;
        Insert: Omit<Club, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Club, "id" | "created_at">>;
      };
      app_users: {
        Row: AppUser;
        Insert: Omit<AppUser, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<AppUser, "id" | "created_at">>;
      };
      customers: {
        Row: Customer;
        Insert: Omit<Customer, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Customer, "id" | "created_at">>;
      };
      memberships: {
        Row: Membership;
        Insert: Omit<Membership, "id" | "created_at">;
        Update: Partial<Omit<Membership, "id" | "created_at">>;
      };
      visits: {
        Row: Visit;
        Insert: Omit<Visit, "id" | "visited_at">;
        Update: never;
      };
      weight_logs: {
        Row: WeightLog;
        Insert: Omit<WeightLog, "id" | "logged_at">;
        Update: Partial<Omit<WeightLog, "id" | "logged_at">>;
      };
      scan_photos: {
        Row: ScanPhoto;
        Insert: Omit<ScanPhoto, "id" | "uploaded_at">;
        Update: never;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      membership_type: MembershipType;
      membership_status: MembershipStatus;
      gender: Gender;
    };
  };
}

// ─── Table Types ─────────────────────────────────────────────────────────────

export interface Club {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AppUser {
  id: string; // matches Supabase auth.users.id
  email: string;
  full_name: string;
  role: UserRole;
  club_id: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  date_of_birth: string | null;
  gender: Gender | null;
  goal: string | null;
  notes: string | null;
  club_id: string;
  trainer_id: string;
  starting_weight: number | null;
  created_at: string;
  updated_at: string;
}

export interface Membership {
  id: string;
  customer_id: string;
  club_id: string;
  type: MembershipType;
  total_days: number;
  days_remaining: number;
  price: number;
  status: MembershipStatus;
  started_at: string;
  expires_at: string | null;
  created_at: string;
}

export interface Visit {
  id: string;
  customer_id: string;
  membership_id: string;
  club_id: string;
  trainer_id: string;
  visited_at: string;
}

export interface WeightLog {
  id: string;
  customer_id: string;
  weight_kg: number;
  log_date: string; // YYYY-MM-DD
  notes: string | null;
  logged_at: string;
}

export interface ScanPhoto {
  id: string;
  customer_id: string;
  photo_url: string;
  scan_number: number;
  day_number: number;
  notes: string | null;
  uploaded_at: string;
}

// ─── Derived / Helper Types ───────────────────────────────────────────────────

export interface CustomerWithMembership extends Customer {
  active_membership: Membership | null;
  club: Pick<Club, "id" | "name" | "logo_url">;
  trainer: Pick<AppUser, "id" | "full_name">;
}

export interface ClubWithStats extends Club {
  trainer_count: number;
  customer_count: number;
  active_membership_count: number;
  expiring_soon_count: number;
}

export interface WeightLogWithChange extends WeightLog {
  change_vs_previous: number | null;
  change_vs_start: number | null;
  day_number: number;
}
