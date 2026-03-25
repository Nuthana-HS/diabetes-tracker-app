require 'net/http'
require 'json'

class DiabetesAiService
  def initialize(user)
    @user = user
    @api_key = ENV['GEMINI_API_KEY']
  end

  def get_insights
    { success: true, insights: "AI insights coming soon!" }
  end

  def chat_response(user_message, health_data)
    return "Please add your Gemini API key in Railway variables" if @api_key.blank?
    
    prompt = "You are a friendly diabetes assistant. User asks: '#{user_message}'. 
              Their morning sugar: #{health_data[:morning_avg]} mg/dL. 
              Give a short, helpful answer under 50 words."
    
    call_gemini_api(prompt)
  end

  private

  def call_gemini_api(prompt)
    uri = URI("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=#{@api_key}")
    
    request_body = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    }
    
    response = Net::HTTP.post(uri, request_body.to_json, {
      'Content-Type' => 'application/json'
    })
    
    result = JSON.parse(response.body)
    
    if result['candidates']
      result['candidates'][0]['content']['parts'][0]['text']
    else
      "I'm here to help! Ask me anything about diabetes management."
    end
  rescue => e
    "I'm having trouble connecting. Please try again later."
  end
end
