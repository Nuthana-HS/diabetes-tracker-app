Rails.application.routes.draw do
  get "health", to: ->(env) { [200, {}, ["OK"]] }

  namespace :api do
    namespace :v1 do
      # Auth routes
      post 'register', to: 'auth#register'
      post 'login', to: 'auth#login'
      get 'me', to: 'users#me'
      patch 'me', to: 'users#update'
      put 'me', to: 'users#update'

      # Resources
      resources :hba1c_records, only: [:index, :create]
      resources :patient_medications, only: [:index, :create, :update]
      resources :blood_sugar_readings, only: [:index, :create, :destroy]
      resources :weight_records, only: [:index, :create, :destroy]
      resources :meal_logs, only: [:index, :create, :destroy]
      resources :activity_logs, only: [:index, :create, :destroy]

      # AI Routes
      post 'ai/chat', to: 'ai#chat'
      get 'ai/insights', to: 'ai#insights'
    end
  end
end
