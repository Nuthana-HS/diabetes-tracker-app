module Api
  module V1
    class Hba1cRecordsController < ApplicationController
      before_action :authenticate_user!

      def index
        patient = current_user.patient
        records = patient.hb_a1c_records.order(date: :desc)
        render json: records
      end

      def create
        patient = current_user.patient
        record = patient.hb_a1c_records.new(hba1c_params)

        if record.save
          render json: record, status: :created
        else
          render json: { errors: record.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def hba1c_params
        params.permit(:value, :date, :notes)
      end
    end
  end
end
