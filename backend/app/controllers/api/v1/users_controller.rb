class Api::V1::UsersController < ApplicationController
  before_action :authenticate_user!

  def me
    if @current_user.patient?
      patient = @current_user.patient
      render json: {
        id: @current_user.id,
        email: @current_user.email,
        name: @current_user.name,
        role: @current_user.role,
        patient_info: {
          current_streak: patient.current_streak,
          last_logged_date: patient.last_logged_date
        }
      }
    else
      render json: {
        id: @current_user.id,
        email: @current_user.email,
        name: @current_user.name,
        role: @current_user.role
      }
    end
  end

  def update
    if @current_user.update(user_update_params)
      # Support frontend expecting full user object
      if @current_user.patient?
        patient = @current_user.patient
        render json: {
          id: @current_user.id,
          email: @current_user.email,
          name: @current_user.name,
          phone: @current_user.phone,
          role: @current_user.role,
          patient_info: {
            current_streak: patient.current_streak,
            last_logged_date: patient.last_logged_date
          }
        }
      else
        render json: {
          id: @current_user.id,
          email: @current_user.email,
          name: @current_user.name,
          phone: @current_user.phone,
          role: @current_user.role
        }
      end
    else
      render json: { errors: @current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_update_params
    params.permit(:name, :phone)
  end
end
