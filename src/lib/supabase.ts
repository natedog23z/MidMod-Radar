import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kxrknfcovqlvuvdwhbbh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4cmtuZmNvdnFsdnV2ZHdoYmJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5MDMwODQsImV4cCI6MjA2MTQ3OTA4NH0.q11bPWbc0ATAcnB_IqzAX_PgAsgDwq5BmQXot2M4-jY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 