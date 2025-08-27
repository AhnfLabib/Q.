-- Move extensions to extensions schema instead of public schema
DROP EXTENSION IF EXISTS pg_cron;
DROP EXTENSION IF EXISTS pg_net;

-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Install extensions in extensions schema
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Update cron schedules to use the fully qualified function names
SELECT extensions.cron.unschedule('daily-newsletter');
SELECT extensions.cron.unschedule('weekly-newsletter');
SELECT extensions.cron.unschedule('monthly-newsletter');

-- Re-schedule with proper schema qualification
SELECT extensions.cron.schedule(
  'daily-newsletter',
  '0 8 * * *',
  $$
  SELECT
    extensions.net.http_post(
        url:='https://yxdpqubitozndqgaacbm.supabase.co/functions/v1/newsletter-scheduler?frequency=daily',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4ZHBxdWJpdG96bmRxZ2FhY2JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNzQ2MjcsImV4cCI6MjA3MTc1MDYyN30.lsj6Wn2ox7F6ALBen3bgueQhGH21DzZt2L1l_h_TuoI"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);

SELECT extensions.cron.schedule(
  'weekly-newsletter',
  '0 8 * * 1',
  $$
  SELECT
    extensions.net.http_post(
        url:='https://yxdpqubitozndqgaacbm.supabase.co/functions/v1/newsletter-scheduler?frequency=weekly',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4ZHBxdWJpdG96bmRxZ2FhY2JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNzQ2MjcsImV4cCI6MjA3MTc1MDYyN30.lsj6Wn2ox7F6ALBen3bgueQhGH21DzZt2L1l_h_TuoI"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);

SELECT extensions.cron.schedule(
  'monthly-newsletter',
  '0 8 1 * *',
  $$
  SELECT
    extensions.net.http_post(
        url:='https://yxdpqubitozndqgaacbm.supabase.co/functions/v1/newsletter-scheduler?frequency=monthly',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4ZHBxdWJpdG96bmRxZ2FhY2JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNzQ2MjcsImV4cCI6MjA3MTc1MDYyN30.lsj6Wn2ox7F6ALBen3bgueQhGH21DzZt2L1l_h_TuoI"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);