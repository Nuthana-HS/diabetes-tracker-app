class CreatePatientMedications < ActiveRecord::Migration[8.0]
  def change
    create_table :patient_medications, id: :uuid do |t|
      t.references :patient, type: :uuid, null: false, foreign_key: true
      t.string :name, null: false
      t.string :dosage
      t.string :frequency
      t.date :start_date
      t.date :end_date
      t.boolean :is_current, default: true

      t.timestamps
    end
  end
end
