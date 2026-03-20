class AddMissingFieldsToPatients < ActiveRecord::Migration[8.1]
  def change
    add_column :patients, :insulin_dependent, :boolean
    add_column :patients, :blood_group, :string
    add_column :patients, :gender, :string
    add_column :patients, :emergency_contact_name, :string
    add_column :patients, :emergency_contact_phone, :string
  end
end
