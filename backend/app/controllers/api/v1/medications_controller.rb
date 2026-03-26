module Api
  module V1
    class MedicationsController < ApplicationController
      before_action :authenticate_user!

      def index
        patient = current_user.patient
        medications = patient.patient_medications.where(is_current: true)
        render json: medications
      end

      def create
        patient = current_user.patient
        medication = patient.patient_medications.new(medication_params)

        if medication.save
          render json: medication, status: :created
        else
          render json: { errors: medication.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        medication = current_user.patient.patient_medications.find(params[:id])
        
        if medication.update(medication_params)
          render json: medication
        else
          render json: { errors: medication.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        medication = current_user.patient.patient_medications.find(params[:id])
        medication.destroy
        head :no_content
      end

      private

      def medication_params
        params.permit(:name, :dosage, :frequency, :is_current, :start_date, :end_date)
      end
    end
  end
end
