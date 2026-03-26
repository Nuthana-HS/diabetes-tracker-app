class ApplicationController < ActionController::API
  include JwtHelper
  
  attr_reader :current_user

  rescue_from StandardError, with: :handle_standard_error

  def authenticate_user!
    token = request.headers['Authorization']&.split(' ')&.last
    return render json: { error: 'Unauthorized: Missing token' }, status: :unauthorized unless token

    payload = decode_token(token)
    return render json: { error: 'Unauthorized: Invalid token or expired' }, status: :unauthorized unless payload

    @current_user = User.find_by(id: payload["user_id"])
    return render json: { error: 'Unauthorized: User not found' }, status: :unauthorized unless @current_user
  end

  private

  def handle_standard_error(exception)
    Rails.logger.error("StandardError [#{exception.class}]: #{exception.message}")
    render json: { error: "Something went wrong. Please try again." }, status: :internal_server_error
  end
end
