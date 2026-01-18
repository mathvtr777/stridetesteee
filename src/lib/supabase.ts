import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our tables
export type RiskType = 'theft' | 'lighting' | 'road' | 'animal' | 'obstacle' | 'other';
export type RiskSeverity = 1 | 2 | 3 | 4 | 5;
export type OccurrenceTime = 'day' | 'night' | 'always';
export type RiskStatus = 'active' | 'resolved' | 'removed';

export interface RiskReport {
    id: string;
    user_id: string;
    lat: number;
    lng: number;
    risk_type: RiskType;
    severity: RiskSeverity;
    occurrence_time: OccurrenceTime;
    description: string | null;
    status: RiskStatus;
    created_at: string;
    upvotes: number;
    downvotes: number;
}

export interface RiskComment {
    id: string;
    report_id: string;
    user_id: string;
    content: string;
    created_at: string;
}
