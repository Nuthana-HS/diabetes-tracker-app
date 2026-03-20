class CreateActivityLogs < ActiveRecord::Migration[8.1]
  def change
    create_table :activity_logs, id: :uuid do |t|
      t.references :patient, type: :uuid, null: false, foreign_key: true
      t.string :activity_type
      t.integer :duration_minutes
      t.string :intensity
      t.datetime :recorded_at
      t.text :notes

      t.timestamps
    end
  end
end
