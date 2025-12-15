import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://giveonkpxrfrvsgiazcn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdmVvbmtweHJmcnZzZ2lhemNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3NTg4NTYsImV4cCI6MjA4MTMzNDg1Nn0.5NzPeK6XMV95LdGjwU90ViUdGiu3LrvJ_RKDdftO30E'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
