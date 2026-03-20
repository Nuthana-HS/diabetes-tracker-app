class Api::V1::AuthController < ApplicationController
  def register
    user = User.new(user_params)
    
    User.transaction do
      if user.save
        if user.patient?
          patient = Patient.new(
            user: user,
            diabetes_type: params[:diabetesType],
            date_of_birth: params[:dateOfBirth],
            insulin_dependent: params[:insulinDependent] == 'yes',
            blood_group: params[:bloodGroup],
            gender: params[:gender],
            emergency_contact_name: params[:emergencyContactName],
            emergency_contact_phone: params[:emergencyContactPhone]
          )
          unless patient.save
            render json: { errors: patient.errors.full_messages }, status: :unprocessable_entity
            raise ActiveRecord::Rollback
          end
        end
        
        token = user.generate_jwt
        render json: { 
          token: token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        }, status: :created
      else
        render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
      end
    end
  end
  
  def login
    user = User.find_by(email: params[:email])
    
    if user&.authenticate(params[:password])
      token = user.generate_jwt
      render json: { 
        token: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end
  
  private
  
  def user_params
    params.permit(:email, :password, :name, :role, :phone)
  end
end
