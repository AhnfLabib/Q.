-- Simply unschedule existing jobs and recreate them properly
SELECT cron.unschedule('daily-newsletter');
SELECT cron.unschedule('weekly-newsletter');  
SELECT cron.unschedule('monthly-newsletter');

-- The extensions were already moved to the extensions schema in the previous migration
-- Now just schedule the jobs with unqualified function names
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