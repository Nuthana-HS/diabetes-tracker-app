Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins %r{\Ahttp://localhost:\d+\z}, %r{\Ahttp://127\.0\.0\.1:\d+\z}, 'localhost:3000', 'localhost:3001', 'localhost:3002', ENV.fetch('FRONTEND_URL', '')
    
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end
