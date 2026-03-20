module Api
  module V1
    class ActivityLogsController < ApplicationController
      before_action :authenticate_user

      def index
        patient = @current_user.patient_profile
        @activity_logs = patient.activity_logs.order(recorded_at: :desc)
        render json: @activity_logs
      end

      def create
        patient = @current_user.patient_profile
        @activity_log = patient.activity_logs.build(activity_log_params)

        if @activity_log.save
          render json: @activity_log, status: :created
        else
          render json: { errors: @activity_log.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        patient = @current_user.patient_profile
        @activity_log = patient.activity_logs.find(params[:id])
        @activity_log.destroy
        head :no_content
      end

      private

      def activity_log_params
        params.permit(:activity_type, :duration_minutes, :intensity, :recorded_at, :notes)
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
