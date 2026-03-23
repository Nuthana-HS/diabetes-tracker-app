class ApplicationController < ActionController::API
  include JwtHelper
  
  attr_reader :current_user
end
