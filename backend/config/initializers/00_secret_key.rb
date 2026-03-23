# Set encryption key for solid gems
ENV['SOLID_QUEUE_ENCRYPTION_KEY'] ||= 'e05de8d13df0bd61'
ENV['ENCRYPTION_KEY'] ||= 'e05de8d13df0bd61'
ENV['SECRET'] ||= 'e05de8d13df0bd61'

# Set @secret directly (this is what the error is looking for)
@secret = ENV['SECRET'] || ENV['ENCRYPTION_KEY'] || 'e05de8d13df0bd61'
