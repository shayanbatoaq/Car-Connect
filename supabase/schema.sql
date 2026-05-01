create extension if not exists "pgcrypto";

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  created_at timestamptz default now()
);

create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade,
  car_color text not null,
  car_brand text not null,
  car_model text not null,
  number_plate text not null,
  qr_token text unique not null,
  status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete cascade,
  amount integer default 999,
  payment_method text default 'cash_on_delivery',
  address_line_1 text not null,
  address_line_2 text,
  postcode text not null,
  city text not null,
  order_status text default 'pending',
  subscription_status text default 'inactive',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade,
  name text not null,
  relationship text not null,
  phone text not null,
  created_at timestamptz default now()
);

create table if not exists contact_requests (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehicles(id) on delete cascade,
  requester_name text,
  requester_phone text,
  message text,
  status text default 'new',
  created_at timestamptz default now()
);
