# Set JWT secret
JWT_SECRET = ENV.fetch("JWT_SECRET_KEY", Rails.application.secret_key_base)

# Also set it in the Rails configuration
Rails.application.config.jwt_secret = JWT_SECRET
