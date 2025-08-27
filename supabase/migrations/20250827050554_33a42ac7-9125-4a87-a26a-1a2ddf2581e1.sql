-- Enable pg_cron and pg_net extensions for scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule daily newsletters at 8 AM UTC
SELECT cron.schedule(
  'daily-newsletter',
  '0 8 * * *',
  $$
  SELECT
    net.http_post(
        url:='https://yxdpqubitozndqgaacbm.supabase.co/functions/v1/newsletter-scheduler?frequency=daily',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4ZHBxdWJpdG96bmRxZ2FhY2JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNzQ2MjcsImV4cCI6MjA3MTc1MDYyN30.lsj6Wn2ox7F6ALBen3bgueQhGH21DzZt2L1l_h_TuoI"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);

-- Schedule weekly newsletters on Mondays at 8 AM UTC
SELECT cron.schedule(
  'weekly-newsletter',
  '0 8 * * 1',
  $$
  SELECT
    net.http_post(
        url:='https://yxdpqubitozndqgaacbm.supabase.co/functions/v1/newsletter-scheduler?frequency=weekly',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4ZHBxdWJpdG96bmRxZ2FhY2JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNzQ2MjcsImV4cCI6MjA3MTc1MDYyN30.lsj6Wn2ox7F6ALBen3bgueQhGH21DzZt2L1l_h_TuoI"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);

-- Schedule monthly newsletters on the 1st of each month at 8 AM UTC
SELECT cron.schedule(
  'monthly-newsletter',
  '0 8 1 * *',
  $$
  SELECT
    net.http_post(
        url:='https://yxdpqubitozndqgaacbm.supabase.co/functions/v1/newsletter-scheduler?frequency=monthly',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4ZHBxdWJpdG96bmRxZ2FhY2JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNzQ2MjcsImV4cCI6MjA3MTc1MDYyN30.lsj6Wn2ox7F6ALBen3bgueQhGH21DzZt2L1l_h_TuoI"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);