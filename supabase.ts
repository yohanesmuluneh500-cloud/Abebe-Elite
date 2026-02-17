
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fxoovbnzzhuifpvoiawd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4b292Ym56emh1aWZwdm9pYXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNTc1MzEsImV4cCI6MjA4NjYzMzUzMX0.Ym9KPAhkcUR0rKua0by5hDblfPrhoWhX4otFwOv-ngM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
