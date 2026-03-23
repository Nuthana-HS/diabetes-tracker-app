Rails.application.routes.draw do
Rails.application.routes.draw do
  get "health", to: ->(env) { [200, {}, ["OK"]] }
  namespace :api do
    namespace :v1 do
      post '/register', to: 'auth#register'
      post '/login', to: 'auth#login'
      get '/me', to: 'users#me'
      put '/me', to: 'users#update'
      patch '/me', to: 'users#update'
      resources :hba1c_records, only: [:index, :create]
      resources :patient_medications, only: [:index, :create, :update]
      resources :blood_sugar_readings, only: [:index, :create, :destroy]
      resources :weight_records, only: [:index, :create, :destroy]
      resources :meal_logs, only: [:index, :create, :destroy]
      resources :activity_logs, only: [:index, :create, :destroy]
    end
  end
end
