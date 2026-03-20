class Api::V1::BloodSugarReadingsController < ApplicationController
  before_action :authenticate_user

  def index
    readings = current_user.patient_profile.blood_sugar_readings
                           .recent
                           .limit(50)
    render json: readings
  end

  def create
    reading = current_user.patient_profile.blood_sugar_readings.build(reading_params)
    reading.recorded_at ||= Time.current

    if reading.save
      render json: reading, status: :created
    else
      render json: { errors: reading.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    reading = current_user.patient_profile.blood_sugar_readings.find(params[:id])
    reading.destroy
    render json: { message: 'Reading deleted' }
  end

  private

  def reading_params
    params.require(:blood_sugar_reading).permit(
      :value, :reading_type, :notes, :recorded_at
    )
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