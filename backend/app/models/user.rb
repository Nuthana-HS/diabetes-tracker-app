class User < ApplicationRecord
  has_secure_password
  
  enum :role, {
    patient: 'patient',
    doctor: 'doctor'
  }
  
  validates :email, presence: true, uniqueness: true
  validates :name, presence: true
  validates :role, presence: true, inclusion: { in: roles.keys }
  
  has_one :patient, dependent: :destroy
  
  def generate_jwt
    JWT.encode(
      {
        user_id: id,
        email: email,
        role: role,
        exp: 24.hours.from_now.to_i
      },
      JWT_SECRET
    )
  end
end
