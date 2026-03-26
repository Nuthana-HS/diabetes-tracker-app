module Api
  module V1
    class MealLogsController < ApplicationController
      before_action :authenticate_user!

      def index
        patient = current_user.patient
        logs = patient.meal_logs.order(recorded_at: :desc)
        render json: logs
      end

      def create
        patient = current_user.patient
        log = patient.meal_logs.new(meal_log_params)

        if log.save
          render json: log, status: :created
        else
          render json: { errors: log.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        log = current_user.patient.meal_logs.find(params[:id])
        log.destroy
        head :no_content
      end

      private

      def meal_log_params
        params.permit(:meal_type, :calories, :carbohydrates_g, :notes, :recorded_at)
      end
    end
  end
end
