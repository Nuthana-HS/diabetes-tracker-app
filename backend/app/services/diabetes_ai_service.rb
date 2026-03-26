require 'net/http'
require 'json'

class DiabetesAiService
  def get_response(prompt)
    api_key = ENV['GEMINI_API_KEY']
    
    return "API key not configured" if api_key.blank?
    
    uri = URI("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=#{api_key}")
    
    body = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    }.to_json
    
    response = Net::HTTP.post(uri, body, { "Content-Type" => "application/json" })
    result = JSON.parse(response.body)
    
    result.dig('candidates', 0, 'content', 'parts', 0, 'text') || "I'm here to help!"
  rescue
    "Service unavailable. Please try again."
  end
end
