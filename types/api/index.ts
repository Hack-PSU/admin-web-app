export enum EventType {
  WORKSHOP = "workshop",
  FOOD = 'food',
  ACTIVITY = 'activity'
}

export interface GetAllHackersResponse {
  "pre_uid"?: string
  "uid": string
  "firstname": string
  "lastname": string
  "gender": string
  "eighteenBeforeEvent": boolean
  "shirt_size": string
  "dietary_restriction"?: string
  "allergies"?: string
  "travel_reimbursement": boolean
  "driving": boolean
  "first_hackathon": boolean
  "university": string
  "email": string
  "academic_year": string
  "major": string
  "resume"?: string
  "mlh_coc": boolean
  "mlh_dcp": boolean
  "phone": string
  "address": string
  "race": string
  "coding_experience": string
  "referral"?: string
  "project"?: string
  "submitted": boolean
  "expectations"?: string
  "veteran": string
  "pin": number
  "share_address_mlh": boolean
  "share_address_sponsors": boolean
  "time": string
  "hackathon": string
  "name": string
  "start_time": string
  "end_time": string
  "base_pin": number
  "active": boolean
  "user_id"?: string
  "rsvp_time"?: string
  "rsvp_status": boolean
  "user_uid"?: string
}

export interface GetAllEventsResponse {
  "uid": string
  "event_location": number
  "event_start_time": number
  "event_end_time": number
  "event_title": string
  "event_description": string
  "event_type": EventType
  "event_icon"?: string
  "ws_presenter_names"?: string
  "ws_skill_level"?: string
  "ws_relevant_skills"?: string
  "hackathon": string
  "location_name": string
  "ws_urls": string[]
}