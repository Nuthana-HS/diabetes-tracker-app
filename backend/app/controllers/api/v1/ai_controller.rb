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

  rescue KeyError => e
    render json: { error: e.message }, status: :internal_server_error
  rescue => e
    Rails.logger.error("AI Chat error: #{e.message}")
    render json: { error: "Something went wrong. Please try again." }, status: :internal_server_error
  end

  def insights
    service = DiabetesAiService.new(current_user)
    reply = service.chat("Give me a summary of my recent diabetes health trends and any concerns.")
    render json: { insights: reply }
  rescue => e
    render json: { error: "Could not generate insights." }, status: :internal_server_error
  end
end
