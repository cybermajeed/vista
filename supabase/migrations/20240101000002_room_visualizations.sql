-- 20240101000002_room_visualizations.sql
-- Table to store AI room visualizations for users

CREATE TABLE IF NOT EXISTS room_visualizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Untitled Room Design',
  original_image_url TEXT NOT NULL,
  generated_image_url TEXT NOT NULL,
  room_type TEXT,
  style TEXT,
  color_palette TEXT,
  lighting TEXT,
  prompt TEXT,
  matched_products JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE room_visualizations ENABLE ROW LEVEL SECURITY;

-- Policies: Users can view, create, update, and delete their own visualizations
CREATE POLICY "Users can view own visualizations"
  ON room_visualizations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own visualizations"
  ON room_visualizations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own visualizations"
  ON room_visualizations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own visualizations"
  ON room_visualizations FOR DELETE
  USING (auth.uid() = user_id);
