class Api::V1::Hba1cRecordsController < ApplicationController
  before_action :authenticate_user

  def index
    patient = current_user.patient_profile
    records = patient.hb_a1c_records.order(date: :desc)
    render json: records
  end

  def create
    patient = current_user.patient_profile
    record = patient.hb_a1c_records.new(record_params)

    if record.save
      render json: record, status: :created
    else
      render json: { errors: record.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def record_params
    params.permit(:value, :date, :notes)
  end

  def authenticate_user
    header = request.headers['Authorization']
    token = header&.split(' ')&.last
    
    if token
      begin
        decoded = JWT.decode(token, Rails.application.secret_key_base).first
        @current_user = User.find_by(id: decoded['user_id'])
      rescue JWT::DecodeError
        render json: { error: 'Invalid token' }, status: :unauthorized
        return
      end
    end
    
    render json: { error: 'Unauthorized' }, status: :unauthorized unless @current_user
  end

  def current_user
    @current_user
  end
end

