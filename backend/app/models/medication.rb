class Medication < ApplicationRecord
  belongs_to :patient
  
  validates :name, presence: true
  validates :start_date, presence: true
  
  scope :current, -> { where(is_current: true) }
  scope :past, -> { where(is_current: false) }
  
  before_save :update_current_status
  
  private
  
  def update_current_status
    if end_date.present? && end_date <= Date.current
      self.is_current = false
    end
  end
end
