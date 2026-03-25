class Api::V1::AiController < ApplicationController
  before_action :authenticate_user!
  
  def insights
    service = DiabetesAiService.new(current_user)
    result = service.get_insights
    
    if result[:success]
      render json: result
    else
      render json: { error: result[:insights] }, status: :service_unavailable
    end
  end
  
  def chat
    user_message = params[:message]
    user_data = params[:userData] || {}
    
    # Get user's actual health data from database
    health_data = {
      morning_avg: user_data[:morningAvg] || 140,
      post_meal_avg: user_data[:postMealAvg] || 180,
      today_reading: user_data[:todayReading] || 130,
      hba1c: current_user.hba1c_records.last&.value,
      blood_sugar: current_user.blood_sugar_readings.last&.value
    }
    
    service = DiabetesAiService.new(current_user)
    reply = service.chat_response(user_message, health_data)
    
    render json: { reply: reply }
  end
end
