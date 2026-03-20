class CreateBloodSugarReadings < ActiveRecord::Migration[7.0]
  def change
    create_table :blood_sugar_readings, id: :uuid do |t|
      t.references :patient, null: false, foreign_key: true, type: :uuid
      t.decimal :value, precision: 6, scale: 2, null: false
      t.string :reading_type, null: false
      t.string :notes
      t.datetime :recorded_at, null: false

      t.timestamps
    end

    add_index :blood_sugar_readings, [:patient_id, :recorded_at]
  end
end