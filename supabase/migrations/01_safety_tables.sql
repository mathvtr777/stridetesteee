-- Create risk_reports table
create table if not exists risk_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  lat double precision not null,
  lng double precision not null,
  risk_type text not null check (risk_type in ('theft', 'lighting', 'road', 'animal', 'obstacle', 'other')),
  severity int not null check (severity between 1 and 5),
  occurrence_time text not null default 'always' check (occurrence_time in ('day', 'night', 'always')),
  description text,
  status text not null default 'active' check (status in ('active', 'resolved', 'removed')),
  created_at timestamptz not null default now(),
  upvotes int not null default 0,
  downvotes int not null default 0
);

-- Create risk_votes table
create table if not exists risk_votes (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references risk_reports(id) on delete cascade not null,
  user_id uuid references auth.users not null,
  vote int not null check (vote in (-1, 1)),
  created_at timestamptz not null default now(),
  unique(report_id, user_id)
);

-- Create risk_comments table
create table if not exists risk_comments (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references risk_reports(id) on delete cascade not null,
  user_id uuid references auth.users not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table risk_reports enable row level security;
alter table risk_votes enable row level security;
alter table risk_comments enable row level security;

-- Policies for risk_reports
create policy "Anyone can view active reports"
  on risk_reports for select
  using (status = 'active' or status = 'resolved');

create policy "Authenticated users can insert reports"
  on risk_reports for insert
  with check (auth.role() = 'authenticated');

create policy "Users can update their own reports"
  on risk_reports for update
  using (auth.uid() = user_id);

-- Policies for risk_votes
create policy "Anyone can view votes"
  on risk_votes for select
  using (true);

create policy "Authenticated users can vote"
  on risk_votes for insert
  with check (auth.role() = 'authenticated');

create policy "Users can update their own votes"
  on risk_votes for update
  using (auth.uid() = user_id);

-- Policies for risk_comments
create policy "Anyone can view comments"
  on risk_comments for select
  using (true);

create policy "Authenticated users can comment"
  on risk_comments for insert
  with check (auth.role() = 'authenticated');

-- RPC function to handle voting and update counts atomically
create or replace function vote_risk(
  report_id_param uuid,
  vote_value int
)
returns void
language plpgsql
security definer
as $$
declare
  existing_vote int;
begin
  -- Check if user has already voted
  select vote into existing_vote
  from risk_votes
  where report_id = report_id_param and user_id = auth.uid();

  if existing_vote is null then
    -- Insert new vote
    insert into risk_votes (report_id, user_id, vote)
    values (report_id_param, auth.uid(), vote_value);

    -- Update report counts
    if vote_value = 1 then
      update risk_reports set upvotes = upvotes + 1 where id = report_id_param;
    else
      update risk_reports set downvotes = downvotes + 1 where id = report_id_param;
    end if;
  elsif existing_vote != vote_value then
    -- Update existing vote
    update risk_votes
    set vote = vote_value
    where report_id = report_id_param and user_id = auth.uid();

    -- Adjust report counts (flip vote)
    if vote_value = 1 then
      update risk_reports set upvotes = upvotes + 1, downvotes = downvotes - 1 where id = report_id_param;
    else
      update risk_reports set downvotes = downvotes + 1, upvotes = upvotes - 1 where id = report_id_param;
    end if;
  end if;
end;
$$;
