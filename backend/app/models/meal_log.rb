class MealLog < ApplicationRecord
  belongs_to :patient

  after_create :update_patient_streak

  private

  def update_patient_streak
    patient.update_streak!
  end
end
