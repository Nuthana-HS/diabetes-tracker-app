
require 'net/http'
require 'json'

class DiabetesAiService
  GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

  def initialize(user)
    @user = user
    @patient = user.patient
    @api_key = ENV.fetch("GEMINI_API_KEY")
  end

  def chat(user_message)
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

      Patient Profile:
      #{context[:profile]}

      Patient's question: #{user_message}

      Instructions:
      - Answer based on the patient's actual data above
      - Flag any concerning patterns
      - Keep response concise and clear
      - Never diagnose — recommend consulting their doctor
    PROMPT

    call_gemini(prompt)
  end

  private

  def build_patient_context
    return empty_context unless @patient

    {
      blood_sugar: fetch_blood_sugar,
      medications: fetch_medications,
      hba1c: fetch_hba1c,
      meals: fetch_meals,
      activities: fetch_activities,
      profile: fetch_profile
    }
  end

  def empty_context
    {
      blood_sugar: "No patient profile found",
      medications: "No patient profile found",
      hba1c: "No patient profile found",
      meals: "No patient profile found",
      activities: "No patient profile found",
      profile: "No patient profile found"
    }
  end

  def fetch_profile
    "Diabetes type: #{@patient.diabetes_type || 'Not specified'}, " \
    "Target HbA1c: #{@patient.target_hba1c}%, " \
    "Insulin dependent: #{@patient.insulin_dependent ? 'Yes' : 'No'}"
  rescue => e
    "Could not fetch profile: #{e.message}"
  end

  def fetch_blood_sugar
    readings = @patient.blood_sugar_readings
                       .where(created_at: 7.days.ago..)
                       .order(created_at: :desc)
    return "No readings found in last 7 days" if readings.empty?
    readings.map { |r| "- #{r.recorded_at&.strftime('%b %d %H:%M') || r.created_at.strftime('%b %d %H:%M')}: #{r.value} mg/dL (#{r.reading_type})" }.join("\n")
  rescue => e
    "Could not fetch blood sugar data: #{e.message}"
  end

  def fetch_medications
    meds = @patient.patient_medications.where(is_current: true)
    return "No medications on record" if meds.empty?
    meds.map { |m| "- #{m.name} #{m.dosage} #{m.frequency}" }.join("\n")
  rescue => e
    "Could not fetch medications: #{e.message}"
  end

  def fetch_hba1c
    records = @patient.hb_a1c_records.order(date: :desc).limit(5)
    return "No HbA1c records found" if records.empty?
    records.map { |h| "- #{h.date&.strftime('%b %Y')}: #{h.value}%" }.join("\n")
  rescue => e
    "Could not fetch HbA1c data: #{e.message}"
  end

  def fetch_meals
    meals = @patient.meal_logs
                    .where(created_at: 3.days.ago..)
                    .order(created_at: :desc)
    return "No meal logs in last 3 days" if meals.empty?
    meals.map { |m| "- #{m.created_at.strftime('%b %d')}: #{m.meal_type} - #{m.calories}kcal #{m.notes}" }.join("\n")
  rescue => e
    "Could not fetch meal data: #{e.message}"
  end

  def fetch_activities
    activities = @patient.activity_logs
                         .where(created_at: 3.days.ago..)
                         .order(created_at: :desc)
    return "No activity logs in last 3 days" if activities.empty?
    activities.map { |a| "- #{a.created_at.strftime('%b %d')}: #{a.activity_type} #{a.duration_minutes}min (#{a.intensity})" }.join("\n")
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
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
    }.to_json

    response = http.request(request)
    parsed = JSON.parse(response.body)

    Rails.logger.info("Gemini response: #{parsed.inspect}")

    parsed.dig("candidates", 0, "content", "parts", 0, "text") ||
      parsed.dig("error", "message") ||
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
