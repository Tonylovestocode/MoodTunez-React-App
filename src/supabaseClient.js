import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://tvielndwhnlogjdyxzwn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2aWVsbmR3aG5sb2dqZHl4enduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4ODcwOTQsImV4cCI6MjA1ODQ2MzA5NH0.vIoixjQ4BMcUTawKstzeBZnPXA6c0aGWRnCTniwPdp0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
