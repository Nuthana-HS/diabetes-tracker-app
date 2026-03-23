# Set encryption key for solid gems
ENV['SOLID_QUEUE_ENCRYPTION_KEY'] ||= 'e05de8d13df0bd61'
ENV['ENCRYPTION_KEY'] ||= 'e05de8d13df0bd61'
ENV['SECRET'] ||= 'e05de8d13df0bd61'

# If @secret is being used directly
if defined?(@secret)
  @secret = ENV['SECRET'] || ENV['ENCRYPTION_KEY']
end
