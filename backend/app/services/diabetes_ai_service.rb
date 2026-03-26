require 'net/http'
require 'json'

class DiabetesAiService
  def initialize(user)
    @user = user
    @api_key = ENV['GEMINI_API_KEY']
  end

  def chat_response(user_message, health_data)
    # Check if API key exists
    if @api_key.blank?
      return "⚠️ Gemini API key not configured. Please add GEMINI_API_KEY in Railway variables."
    end
    
    # Build the prompt
    prompt = "You are a friendly diabetes assistant. User asks: '#{user_message}'. 
              Their morning sugar: #{health_data[:morning_avg]} mg/dL. 
              Their latest HbA1c: #{health_data[:hba1c] || 'no data'}%.
              Give a short, helpful, friendly answer in under 50 words."
    
    # Call Gemini API
    uri = URI("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=#{@api_key}")
    
    request_body = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    }
    
    begin
      response = Net::HTTP.post(uri, request_body.to_json, {
        'Content-Type' => 'application/json'
      })
      
      result = JSON.parse(response.body)
      
      if result['candidates'] && result['candidates'][0]
        return result['candidates'][0]['content']['parts'][0]['text']
      else
        return "I'm here to help! Could you rephrase your question?"
      end
    rescue => e
      return "Sorry, I'm having trouble connecting. Please try again later. Error: #{e.message}"
    end
  end
end
