Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins %r{\Ahttp://localhost:\d+\z},
             %r{\Ahttp://127\.0\.0\.1:\d+\z},
             'localhost:3000',
             'localhost:3001',
             'localhost:3002',
             'https://diabetes-tracker-app.vercel.app',
             ENV.fetch('FRONTEND_URL', '')

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end
```

---

**Step 2: Create `app/services/diabetes_ai_service.rb`**

Paste the full `DiabetesAiService` code I gave in my previous message exactly as-is.

---

**Step 3: Replace `app/controllers/api/v1/ai_controller.rb`**

Paste the fixed controller code from my previous message.

---

**Step 4: Set environment variables in Railway**

Go to Railway → your project → **Variables** tab and add:
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxx
FRONTEND_URL=https://diabetes-tracker-app.vercel.app