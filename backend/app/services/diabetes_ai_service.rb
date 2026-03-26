require 'net/http'
require 'json'

class DiabetesAiService
  GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent"

  def initialize(user)
    @user = user
    @api_key = ENV.fetch("GEMINI_API_KEY")
  end

  def chat(user_message)
    # Fetch patient context before calling AI
    context = build_patient_context

    prompt = <<~PROMPT
      You are a compassionate diabetes care assistant.
      
      Here is the patient's current health data:
      
      🩸 Blood Sugar (last 7 days):
      #{context[:blood_sugar]}
      
      💊 Current Medications:
      #{context[:medications]}
      
      📊 HbA1c History:
      #{context[:hba1c]}
      
      🍽️ Recent Meals (last 3 days):
      #{context[:meals]}
      
      🏃 Recent Activities (last 3 days):
      #{context[:activities]}
      
      Patient's question: #{user_message}
      
      Instructions:
      - Answer based on the patient's actual data above
      - Flag any concerning patterns (e.g. consistently high readings)
      - Keep response concise and clear
      - Never diagnose — recommend consulting their doctor for medical decisions
    PROMPT

    call_gemini(prompt)
  end

  private

  def build_patient_context
    {
      blood_sugar: fetch_blood_sugar,
      medications: fetch_medications,
      hba1c: fetch_hba1c,
      meals: fetch_meals,
      activities: fetch_activities
    }
  end

  def fetch_blood_sugar
    readings = @user.blood_sugar_readings
                    .where(created_at: 7.days.ago..)
                    .order(created_at: :desc)

    return "No readings found in last 7 days" if readings.empty?

    readings.map do |r|
      "- #{r.created_at.strftime('%b %d %H:%M')}: #{r.value} #{r.unit rescue 'mg/dL'}"
    end.join("\n")
  rescue => e
    "Could not fetch blood sugar data: #{e.message}"
  end

  def fetch_medications
    meds = @user.patient_medications

    return "No medications on record" if meds.empty?

    meds.map do |m|
      "- #{m.name} #{m.dosage rescue ''} #{m.frequency rescue ''}"
    end.join("\n")
  rescue => e
    "Could not fetch medications: #{e.message}"
  end

  def fetch_hba1c
    records = @user.hba1c_records
                   .order(created_at: :desc)
                   .limit(5)

    return "No HbA1c records found" if records.empty?

    records.map do |h|
      "- #{h.created_at.strftime('%b %Y')}: #{h.value}%"
    end.join("\n")
  rescue => e
    "Could not fetch HbA1c data: #{e.message}"
  end

  def fetch_meals
    meals = @user.meal_logs
                 .where(created_at: 3.days.ago..)
                 .order(created_at: :desc)

    return "No meal logs in last 3 days" if meals.empty?

    meals.map do |m|
      "- #{m.created_at.strftime('%b %d')}: #{m.description rescue m.food_name rescue 'Meal logged'}"
    end.join("\n")
  rescue => e
    "Could not fetch meal data: #{e.message}"
  end

  def fetch_activities
    activities = @user.activity_logs
                      .where(created_at: 3.days.ago..)
                      .order(created_at: :desc)

    return "No activity logs in last 3 days" if activities.empty?

    activities.map do |a|
      "- #{a.created_at.strftime('%b %d')}: #{a.activity_type rescue a.name rescue 'Activity logged'}"
    end.join("\n")
  rescue => e
    "Could not fetch activity data: #{e.message}"
  end

  def call_gemini(prompt)
    uri = URI("#{GEMINI_API_URL}?key=#{@api_key}")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.read_timeout = 30

    request = Net::HTTP::Post.new(uri)
    request["Content-Type"] = "application/json"

    request.body = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_ONLY_HIGH"
        }
      ]
    }.to_json

    response = http.request(request)
    parsed = JSON.parse(response.body)

    # Extract text from Gemini response
    parsed.dig("candidates", 0, "content", "parts", 0, "text") ||
      "I could not generate a response. Please try again."

  rescue KeyError
    raise "GEMINI_API_KEY is not configured"
  rescue Net::ReadTimeout
    "The AI is taking too long to respond. Please try again."
  rescue => e
    Rails.logger.error("Gemini API error: #{e.message}")
    "Something went wrong with the AI. Please try again."
  end
end