class Patient < ApplicationRecord
  belongs_to :user
  has_many :hb_a1c_records, dependent: :destroy
  has_many :patient_medications, dependent: :destroy
  has_many :blood_sugar_readings, dependent: :destroy
  has_many :weight_records, dependent: :destroy
  has_many :meal_logs, dependent: :destroy
  has_many :activity_logs, dependent: :destroy

  def update_streak!
    today = Date.current
    return if last_logged_date == today

    self.current_streak ||= 0
    if last_logged_date == today - 1.day
      self.current_streak += 1
    else
      self.current_streak = 1
    end
    self.last_logged_date = today
    save(validate: false)
  end
end
