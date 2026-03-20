class Api::V1::PatientMedicationsController < ApplicationController
  before_action :authenticate_user

  def index
    patient = current_user.patient_profile
    medications = patient.patient_medications.order(created_at: :desc)
    render json: medications
  end

  def create
    patient = current_user.patient_profile
    medication = patient.patient_medications.build(medication_params)

    if medication.save
      render json: medication, status: :created
    else
      render json: { errors: medication.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    medication = PatientMedication.find(params[:id])
    if medication.update(medication_params)
      render json: medication
    else
      render json: { errors: medication.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def medication_params
    params.permit(:name, :dosage, :frequency, :start_date, :end_date, :is_current)
  end

  def authenticate_user
    header = request.headers['Authorization']
    token = header&.split(' ')&.last
    
    if token
      decoded = JWT.decode(token, Rails.application.secret_key_base).first
      @current_user = User.find_by(id: decoded['user_id'])
    end
    
    render json: { error: 'Unauthorized' }, status: :unauthorized unless @current_user
  end

  def current_user
    @current_user
  end
end
