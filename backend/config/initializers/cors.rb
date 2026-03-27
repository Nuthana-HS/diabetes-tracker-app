Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'https://diabetes-tracker-app.vercel.app', 
            'https://diabetes-tracker-app-git-main-nuthana-hs-projects.vercel.app',
            'http://localhost:3000',
            'http://localhost:3001'
    
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end
