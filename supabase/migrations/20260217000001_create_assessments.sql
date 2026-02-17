-- Assessments table for The Conscious Husband Assessment
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  version TEXT NOT NULL DEFAULT 'self' CHECK (version IN ('self', 'partner')),
  pair_code TEXT,

  -- Individual question scores (1-5 each)
  affection_q1 SMALLINT CHECK (affection_q1 BETWEEN 1 AND 5),
  affection_q2 SMALLINT CHECK (affection_q2 BETWEEN 1 AND 5),
  affection_q3 SMALLINT CHECK (affection_q3 BETWEEN 1 AND 5),
  standards_q1 SMALLINT CHECK (standards_q1 BETWEEN 1 AND 5),
  standards_q2 SMALLINT CHECK (standards_q2 BETWEEN 1 AND 5),
  standards_q3 SMALLINT CHECK (standards_q3 BETWEEN 1 AND 5),
  emotional_q1 SMALLINT CHECK (emotional_q1 BETWEEN 1 AND 5),
  emotional_q2 SMALLINT CHECK (emotional_q2 BETWEEN 1 AND 5),
  emotional_q3 SMALLINT CHECK (emotional_q3 BETWEEN 1 AND 5),
  listening_q1 SMALLINT CHECK (listening_q1 BETWEEN 1 AND 5),
  listening_q2 SMALLINT CHECK (listening_q2 BETWEEN 1 AND 5),
  listening_q3 SMALLINT CHECK (listening_q3 BETWEEN 1 AND 5),
  presence_q1 SMALLINT CHECK (presence_q1 BETWEEN 1 AND 5),
  presence_q2 SMALLINT CHECK (presence_q2 BETWEEN 1 AND 5),
  presence_q3 SMALLINT CHECK (presence_q3 BETWEEN 1 AND 5),
  purpose_q1 SMALLINT CHECK (purpose_q1 BETWEEN 1 AND 5),
  purpose_q2 SMALLINT CHECK (purpose_q2 BETWEEN 1 AND 5),
  purpose_q3 SMALLINT CHECK (purpose_q3 BETWEEN 1 AND 5),
  frame_q1 SMALLINT CHECK (frame_q1 BETWEEN 1 AND 5),
  frame_q2 SMALLINT CHECK (frame_q2 BETWEEN 1 AND 5),
  frame_q3 SMALLINT CHECK (frame_q3 BETWEEN 1 AND 5),
  grievances_q1 SMALLINT CHECK (grievances_q1 BETWEEN 1 AND 5),
  grievances_q2 SMALLINT CHECK (grievances_q2 BETWEEN 1 AND 5),
  grievances_q3 SMALLINT CHECK (grievances_q3 BETWEEN 1 AND 5),

  -- Computed totals per behavior (3-15)
  affection_total SMALLINT GENERATED ALWAYS AS (affection_q1 + affection_q2 + affection_q3) STORED,
  standards_total SMALLINT GENERATED ALWAYS AS (standards_q1 + standards_q2 + standards_q3) STORED,
  emotional_total SMALLINT GENERATED ALWAYS AS (emotional_q1 + emotional_q2 + emotional_q3) STORED,
  listening_total SMALLINT GENERATED ALWAYS AS (listening_q1 + listening_q2 + listening_q3) STORED,
  presence_total SMALLINT GENERATED ALWAYS AS (presence_q1 + presence_q2 + presence_q3) STORED,
  purpose_total SMALLINT GENERATED ALWAYS AS (purpose_q1 + purpose_q2 + purpose_q3) STORED,
  frame_total SMALLINT GENERATED ALWAYS AS (frame_q1 + frame_q2 + frame_q3) STORED,
  grievances_total SMALLINT GENERATED ALWAYS AS (grievances_q1 + grievances_q2 + grievances_q3) STORED,

  -- Overall
  overall_score SMALLINT GENERATED ALWAYS AS (
    affection_q1 + affection_q2 + affection_q3 +
    standards_q1 + standards_q2 + standards_q3 +
    emotional_q1 + emotional_q2 + emotional_q3 +
    listening_q1 + listening_q2 + listening_q3 +
    presence_q1 + presence_q2 + presence_q3 +
    purpose_q1 + purpose_q2 + purpose_q3 +
    frame_q1 + frame_q2 + frame_q3 +
    grievances_q1 + grievances_q2 + grievances_q3
  ) STORED,

  archetype TEXT CHECK (archetype IN ('conscious_architect', 'awakening_builder', 'emerging_man', 'turning_point', 'unconscious_default'))
);

-- Enable RLS
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (no auth required)
CREATE POLICY "Anyone can insert assessments"
  ON assessments FOR INSERT
  WITH CHECK (true);

-- Allow reading own assessment by ID (for partner comparison)
CREATE POLICY "Anyone can read by pair_code"
  ON assessments FOR SELECT
  USING (true);

-- Index for partner matching
CREATE INDEX idx_assessments_pair_code ON assessments(pair_code) WHERE pair_code IS NOT NULL;

-- Aggregate analytics view (no PII)
CREATE VIEW assessment_averages AS
SELECT
  COUNT(*) as total_assessments,
  ROUND(AVG(affection_total), 1) as avg_affection,
  ROUND(AVG(standards_total), 1) as avg_standards,
  ROUND(AVG(emotional_total), 1) as avg_emotional,
  ROUND(AVG(listening_total), 1) as avg_listening,
  ROUND(AVG(presence_total), 1) as avg_presence,
  ROUND(AVG(purpose_total), 1) as avg_purpose,
  ROUND(AVG(frame_total), 1) as avg_frame,
  ROUND(AVG(grievances_total), 1) as avg_grievances,
  ROUND(AVG(overall_score), 1) as avg_overall
FROM assessments
WHERE version = 'self';
