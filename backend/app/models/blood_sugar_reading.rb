class BloodSugarReading < ApplicationRecord
  belongs_to :patient

  validates :value, presence: true, numericality: { greater_than: 0 }
  validates :reading_type, presence: true, inclusion: { 
    in: ['fasting', 'post_meal', 'bedtime', 'random'] 
  }
  validates :recorded_at, presence: true

  scope :recent, -> { order(recorded_at: :desc) }
  scope :today, -> { where(recorded_at: Time.current.beginning_of_day..Time.current.end_of_day) }
end