module Api
  module V1
    class ActivityLogsController < ApplicationController
      before_action :authenticate_user!
      
      def index
        patient = current_user.patient
        logs = patient.activity_logs.order(recorded_at: :desc)
        render json: logs
      end
      
      def create
        patient = current_user.patient
        log = patient.activity_logs.new(activity_log_params)
        
        if log.save
          render json: log, status: :created
        else
          render json: { errors: log.errors.full_messages }, status: :unprocessable_entity
        end
      end
      
      def destroy
        log = current_user.patient.activity_logs.find(params[:id])
        log.destroy
        head :no_content
      end
      
      private
      
      def activity_log_params
        params.permit(:activity_type, :duration_minutes, :intensity, :notes, :recorded_at)
      end
    end
  end
end