class HbA1cRecord < ApplicationRecord
  belongs_to :patient
  
  validates :value, presence: true, numericality: { greater_than: 0, less_than: 20 }
  validates :date, presence: true
  
  scope :chronological, -> { order(date: :asc) }
  scope :reverse_chronological, -> { order(date: :desc) }
  
  def color_code
    case value
    when 0...7 then 'green'
    when 7...8 then 'yellow'
    else 'red'
    end
  end
end
