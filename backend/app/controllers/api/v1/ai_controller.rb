class Api::V1::AiController < ApplicationController
  before_action :authenticate_user!
  
  def chat
    user_message = params[:message]
    
    prompt = "You are a diabetes assistant. Answer briefly: #{user_message}"
    
    service = DiabetesAiService.new
    reply = service.get_response(prompt)
    
    render json: { reply: reply }
  end
end