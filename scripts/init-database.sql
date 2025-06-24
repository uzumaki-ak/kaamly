-- Create users table (handled by Supabase Auth)
-- This script creates additional tables for our app

-- Enable Row Level Security
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

-- Create policies for appointments
CREATE POLICY "Users can view their own appointments" ON appointments
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own appointments" ON appointments
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own appointments" ON appointments
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Create policies for tasks
CREATE POLICY "Users can view their own tasks" ON tasks
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Create indexes for better performance
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_scheduled_time ON appointments(scheduled_time);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_providers_type ON providers(type);

-- Insert some sample providers for testing
INSERT INTO providers (name, type, phone, address, latitude, longitude, rating, price_range) VALUES
('Style Studio', 'salon', '+91-9876543210', 'Connaught Place, New Delhi', 28.6315, 77.2167, 4.5, '$$'),
('Quick Cuts Barber', 'barber', '+91-9876543211', 'Karol Bagh, New Delhi', 28.6519, 77.1909, 4.2, '$'),
('Luxury Spa & Salon', 'spa', '+91-9876543212', 'Khan Market, New Delhi', 28.5984, 77.2319, 4.8, '$$$'),
('Modern Hair Studio', 'salon', '+91-9876543213', 'Lajpat Nagar, New Delhi', 28.5677, 77.2431, 4.3, '$$'),
('Gentleman\'s Barber Shop', 'barber', '+91-9876543214', 'Rajouri Garden, New Delhi', 28.6469, 77.1200, 4.1, '$');
