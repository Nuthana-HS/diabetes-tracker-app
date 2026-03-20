class AddStreakToPatients < ActiveRecord::Migration[8.1]
  def change
    add_column :patients, :current_streak, :integer, default: 0
    add_column :patients, :last_logged_date, :date
  end
end
