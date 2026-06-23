export type UserRole = "user" | "agent" | "system" | "admin";

export type ProfileStatus =
  | "To Be Verified"
  | "Verified"
  | "In Process"
  | "Withdrawn by Client"
  | "Completed";

export interface Sibling {
  description: string;
}

export interface Profile {
  id: string;
  internal_id: number;
  user_id_handle: string | null;
  gender: string | null;
  dob: string | null;
  age: number | null;
  email: string | null;
  whatsapp_no: string | null;
  name_private: string | null;
  marital_status: string | null;
  height_ft: number | null;
  height_in: number | null;
  height_cm: number | null;
  weight_kg: number | null;
  qualification: string | null;
  profession: string[] | null;
  profession_detail: string | null;
  religion: string | null;
  sect: string | null;
  practice_nazar: string | null;
  caste: string | null;
  sub_caste: string | null;
  describe_yourself: string | null;
  job_details: string | null;
  income_details: string | null;
  family_details: string | null;
  nationality: string[] | null;
  residence_country: string[] | null;
  city: string[] | null;
  residence_type: string | null;
  property_size: string | null;
  story_type: string | null;
  other_properties: string | null;
  father_name: string | null;
  father_occupation: string | null;
  mother_occupation: string | null;
  siblings: Sibling[] | null;
  brothers: number | null;
  sisters: number | null;
  father_contact: string | null;
  mother_contact: string | null;
  candidate_contact: string | null;
  status: ProfileStatus;
  role: UserRole;
  agent_id: string | null;
  agent_registration_no: string | null;
  registration_date: string | null;
  verified_at: string | null;
  avatar_url: string | null;
  photos: string[] | null;
  video_url: string | null;
  doc_verification_status: string | null;
  registration_step: number | null;
  photo_visibility: string;
  video_visibility: string;
  notification_prefs: NotificationPrefs | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationPrefs {
  matches: boolean;
  payments: boolean;
  marketing: boolean;
}

export type PublicProfile = Pick<
  Profile,
  | "id"
  | "internal_id"
  | "user_id_handle"
  | "gender"
  | "age"
  | "marital_status"
  | "height_ft"
  | "height_in"
  | "height_cm"
  | "qualification"
  | "profession"
  | "religion"
  | "sect"
  | "caste"
  | "sub_caste"
  | "describe_yourself"
  | "nationality"
  | "residence_country"
  | "city"
  | "status"
  | "role"
  | "avatar_url"
  | "photos"
  | "video_url"
  | "created_at"
>;

export interface Requirements {
  id?: string;
  profile_id: string;
  min_age: number | null;
  max_age: number | null;
  height_range: string | null;
  religions: string[];
  sects: string[];
  languages: string[];
  castes: string[];
  sub_castes: string[];
  regions: string[];
  countries: string[];
  cities: string[];
  qualifications: string[];
  professions: string[];
  others: string | null;
}

export interface DynamicValue {
  id: string;
  category: string;
  value: string;
  country: string | null;
  approved: boolean;
  created_at: string;
}

export interface OfficeNote {
  id: string;
  profile_id: string;
  created_by: string | null;
  note: string;
  created_at: string;
}

export interface Payment {
  id: string;
  profile_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string | null;
  transaction_ref: string | null;
  verified_by: string | null;
  created_at: string;
}

export interface WhatsAppLog {
  id: string;
  profile_id: string | null;
  direction: "inbound" | "outbound";
  message: string;
  created_at: string;
}

export interface AgentProfile {
  id: string;
  profile_id: string;
  bank_name: string | null;
  branch: string | null;
  account_name: string | null;
  account_no: string | null;
  iban: string | null;
  created_at: string;
}

export interface ContactRequest {
  id: string;
  searcher_id: string;
  target_id: string;
  status: "pending" | "approved" | "rejected";
  approved_by: string | null;
  whatsapp_sent: boolean;
  created_at: string;
}

export interface BankAccount {
  id: string;
  currency: string;
  country: string | null;
  bank_name: string;
  branch: string | null;
  account_name: string;
  account_no: string | null;
  iban: string | null;
  active: boolean;
  created_at: string;
}

export interface ContactDetails {
  father_contact: string | null;
  mother_contact: string | null;
  candidate_contact: string | null;
  whatsapp_no: string | null;
}
