module Api
  module V1
    class MealLogsController < ApplicationController
      before_action :authenticate_user

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
    end
  end
end
