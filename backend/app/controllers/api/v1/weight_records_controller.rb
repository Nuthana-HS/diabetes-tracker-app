class Api::V1::WeightRecordsController < ApplicationController
  before_action :set_patient

  def index
    @weight_records = @patient.weight_records.order(recorded_at: :desc)
    render json: @weight_records
  end

  def create
    @weight_record = @patient.weight_records.build(weight_record_params)
    
    if @weight_record.save
      render json: @weight_record, status: :created
    else
      render json: { errors: @weight_record.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @weight_record = @patient.weight_records.find(params[:id])
    @weight_record.destroy
    head :no_content
  end

  private

  def set_patient
    @patient = current_user.patient_profile
    unless @patient
      render json: { error: 'Patient profile not found' }, status: :not_found
    end
  end

  def weight_record_params
    params.require(:weight_record).permit(:value, :recorded_at, :notes)
  end
end
