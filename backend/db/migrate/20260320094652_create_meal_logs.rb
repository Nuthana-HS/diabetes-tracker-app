class CreateMealLogs < ActiveRecord::Migration[8.1]
  def change
    create_table :meal_logs, id: :uuid do |t|
      t.references :patient, type: :uuid, null: false, foreign_key: true
      t.string :meal_type
      t.integer :carbohydrates_g
      t.integer :calories
      t.datetime :recorded_at
      t.text :notes

      t.timestamps
    end
  end
end
