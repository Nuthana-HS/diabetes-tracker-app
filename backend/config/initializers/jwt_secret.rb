# Set JWT secret
JWT_SECRET = ENV['JWT_SECRET_KEY'] || ENV['SECRET_KEY_BASE'] || 'e05de8d13df0bd61e05de8d13df0bd61'

# Also set it in the Rails configuration
Rails.application.config.jwt_secret = JWT_SECRET
