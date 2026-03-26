class Api::V1::AiController < ApplicationController
  before_action :authenticate_user!

  def chat
    user_message = params[:message]

    if user_message.blank?
      return render json: { error: "Message cannot be blank" }, status: :unprocessable_entity
    end

    service = DiabetesAiService.new(current_user)
    reply = service.chat(user_message)
    render json: { reply: reply }
  end

  def insights
    service = DiabetesAiService.new(current_user)
    reply = service.chat("Give me a summary of my recent diabetes health trends and any concerns.")
    render json: { insights: reply }
  end
end
