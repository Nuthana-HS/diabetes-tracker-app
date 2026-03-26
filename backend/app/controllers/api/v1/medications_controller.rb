class Api::V1::MedicationsController < ApplicationController
  before_action :authenticate_user!

  def index
    patient = current_user.patient_profile
    medications = patient.medications.order(created_at: :desc)
    render json: medications
  end

  def create
    patient = current_user.patient_profile
    medication = patient.medications.build(medication_params)

    if medication.save
      render json: medication, status: :created
    else
      render json: { errors: medication.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    medication = Medication.find(params[:id])
    if medication.patient.user == current_user
      if medication.update(medication_params)
        render json: medication
      else
        render json: { errors: medication.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  def destroy
    medication = Medication.find(params[:id])
    if medication.patient.user == current_user
      medication.destroy
      head :no_content
    else
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  private

  def medication_params
    params.permit(:name, :dosage, :frequency, :start_date, :end_date, :is_current)
  end

