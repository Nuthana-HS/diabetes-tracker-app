module Api
  module V1
    class MealLogsController < ApplicationController
      before_action :authenticate_user!

      def index
        patient = @current_user.patient_profile
        @meal_logs = patient.meal_logs.order(recorded_at: :desc)
        render json: @meal_logs
      end

      def create
        patient = @current_user.patient_profile
        @meal_log = patient.meal_logs.build(meal_log_params)

        if @meal_log.save
          render json: @meal_log, status: :created
        else
          render json: { errors: @meal_log.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        patient = @current_user.patient_profile
        @meal_log = patient.meal_logs.find(params[:id])
        @meal_log.destroy
        head :no_content
      end

      private

      def meal_log_params
        params.permit(:meal_type, :carbohydrates_g, :calories, :recorded_at, :notes)
      end

