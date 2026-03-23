# Load the Rails application.
require_relative "application"

# Set global secret before Rails initializes
$secret = ENV['SECRET'] || 'e05de8d13df0bd61'
@secret = $secret

# Initialize the Rails application.
Rails.application.initialize!
