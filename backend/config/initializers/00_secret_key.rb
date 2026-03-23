# Set encryption key for solid gems
ENV['SOLID_QUEUE_ENCRYPTION_KEY'] ||= 'e05de8d13df0bd61'
ENV['ENCRYPTION_KEY'] ||= 'e05de8d13df0bd61'
ENV['SECRET'] ||= 'e05de8d13df0bd61'

# Set @secret as a global variable (accessible everywhere)
$secret = ENV['SECRET'] || ENV['ENCRYPTION_KEY'] || 'e05de8d13df0bd61'
@secret = $secret  # Also set instance variable for compatibility

# Set as a constant
SECRET_KEY = $secret
