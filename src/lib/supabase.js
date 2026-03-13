import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://bfjnebplrvwflfszkayc.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmam5lYnBscnZ3Zmxmc3prYXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTE2MjcsImV4cCI6MjA4ODk2NzYyN30.BhonrUwjF-ONrLfTPCalB0S_ZuDgY9iRxpxqOkiyWu8"

export const supabase = createClient(supabaseUrl, supabaseKey)