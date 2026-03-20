class CreateHbA1cRecords < ActiveRecord::Migration[8.0]
  def change
    create_table :hb_a1c_records, id: :uuid do |t|
      t.references :patient, type: :uuid, null: false, foreign_key: true
      t.decimal :value, precision: 3, scale: 1, null: false
      t.date :date, null: false
      t.text :notes
      t.string :file_path

      t.timestamps
    end
  end
end
