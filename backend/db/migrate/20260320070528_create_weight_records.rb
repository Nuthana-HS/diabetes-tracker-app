class CreateWeightRecords < ActiveRecord::Migration[8.1]
  def change
    create_table :weight_records, id: :uuid do |t|
      t.references :patient, type: :uuid, null: false, foreign_key: true
      t.decimal :value
      t.datetime :recorded_at
      t.text :notes

      t.timestamps
    end
  end
end
