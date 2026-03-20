class CreatePatients < ActiveRecord::Migration[8.0]
  def change
    create_table :patients, id: :uuid do |t|
      t.references :user, type: :uuid, null: false, foreign_key: true
      t.string :diabetes_type
      t.date :diagnosis_date
      t.date :date_of_birth
      t.decimal :target_hba1c, precision: 3, scale: 1, default: 7.0

      t.timestamps
    end
  end
end
