# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_03_20_094653) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"
  enable_extension "pgcrypto"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.bigint "record_id", null: false
    t.string "record_type", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.string "content_type"
    t.datetime "created_at", null: false
    t.string "filename", null: false
    t.string "key", null: false
    t.text "metadata"
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "activity_logs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "activity_type"
    t.datetime "created_at", null: false
    t.integer "duration_minutes"
    t.string "intensity"
    t.text "notes"
    t.uuid "patient_id", null: false
    t.datetime "recorded_at"
    t.datetime "updated_at", null: false
    t.index ["patient_id"], name: "index_activity_logs_on_patient_id"
  end

  create_table "blood_sugar_readings", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "notes"
    t.uuid "patient_id", null: false
    t.string "reading_type", null: false
    t.datetime "recorded_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "value", precision: 6, scale: 2, null: false
    t.index ["patient_id", "recorded_at"], name: "index_blood_sugar_readings_on_patient_id_and_recorded_at"
    t.index ["patient_id"], name: "index_blood_sugar_readings_on_patient_id"
  end

  create_table "hb_a1c_records", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.date "date", null: false
    t.string "file_path"
    t.text "notes"
    t.uuid "patient_id", null: false
    t.datetime "updated_at", null: false
    t.decimal "value", precision: 3, scale: 1, null: false
    t.index ["patient_id"], name: "index_hb_a1c_records_on_patient_id"
  end

  create_table "meal_logs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.integer "calories"
    t.integer "carbohydrates_g"
    t.datetime "created_at", null: false
    t.string "meal_type"
    t.text "notes"
    t.uuid "patient_id", null: false
    t.datetime "recorded_at"
    t.datetime "updated_at", null: false
    t.index ["patient_id"], name: "index_meal_logs_on_patient_id"
  end

  create_table "medications", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "dosage"
    t.date "end_date"
    t.string "frequency"
    t.boolean "is_current", default: true
    t.string "name", null: false
    t.uuid "patient_id", null: false
    t.date "start_date"
    t.datetime "updated_at", null: false
    t.index ["patient_id"], name: "index_medications_on_patient_id"
  end

  create_table "patient_medications", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "dosage"
    t.date "end_date"
    t.string "frequency"
    t.boolean "is_current", default: true
    t.string "name", null: false
    t.uuid "patient_id", null: false
    t.date "start_date"
    t.datetime "updated_at", null: false
    t.index ["patient_id"], name: "index_patient_medications_on_patient_id"
  end

  create_table "patients", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "blood_group"
    t.datetime "created_at", null: false
    t.integer "current_streak", default: 0
    t.date "date_of_birth"
    t.string "diabetes_type"
    t.date "diagnosis_date"
    t.string "emergency_contact_name"
    t.string "emergency_contact_phone"
    t.string "gender"
    t.boolean "insulin_dependent"
    t.date "last_logged_date"
    t.decimal "target_hba1c", precision: 3, scale: 1, default: "7.0"
    t.datetime "updated_at", null: false
    t.uuid "user_id", null: false
    t.index ["user_id"], name: "index_patients_on_user_id"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "name", null: false
    t.string "password_digest", null: false
    t.string "phone"
    t.string "role", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["role"], name: "index_users_on_role"
  end

  create_table "weight_records", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "notes"
    t.uuid "patient_id", null: false
    t.datetime "recorded_at"
    t.datetime "updated_at", null: false
    t.decimal "value"
    t.index ["patient_id"], name: "index_weight_records_on_patient_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "activity_logs", "patients"
  add_foreign_key "blood_sugar_readings", "patients"
  add_foreign_key "hb_a1c_records", "patients"
  add_foreign_key "meal_logs", "patients"
  add_foreign_key "medications", "patients"
  add_foreign_key "patient_medications", "patients"
  add_foreign_key "patients", "users"
  add_foreign_key "weight_records", "patients"
end
