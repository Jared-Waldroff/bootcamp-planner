-- Create Exercises Table
create table public.exercises (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null,
  partner_exercise boolean default false,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Workouts Table
create table public.workouts (
  id uuid default gen_random_uuid() primary key,
  date date not null,
  exercises jsonb not null, -- Storing the 3 selected exercises as JSON for simplicity
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.exercises enable row level security;
alter table public.workouts enable row level security;

-- Create Policies (Allow public read/write for now since we don't have auth)
create policy "Allow public read exercises"
on public.exercises for select using (true);

create policy "Allow public insert exercises"
on public.exercises for insert with check (true);

create policy "Allow public update exercises"
on public.exercises for update using (true);

create policy "Allow public delete exercises"
on public.exercises for delete using (true);

create policy "Allow public read workouts"
on public.workouts for select using (true);

create policy "Allow public insert workouts"
on public.workouts for insert with check (true);

create policy "Allow public update workouts"
on public.workouts for update using (true);
