module JwtHelper
  def jwt_secret
    JWT_SECRET
  end
  
  def decode_token(token)
    JWT.decode(token, jwt_secret).first
  rescue JWT::DecodeError
    nil
  end
end
