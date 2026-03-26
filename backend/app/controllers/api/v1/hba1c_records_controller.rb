class Api::V1::Hba1cRecordsController < ApplicationController
  before_action :authenticate_user!

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

