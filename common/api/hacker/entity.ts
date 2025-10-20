export interface UserEntity {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  shirtSize: string;
  dietaryRestriction?: string;
  allergies?: string;
  university: string;
  email: string;
  major: string;
  phone: string;
  country: string;
  race: string;
  resume: string;
}

export interface MLHDataEntity {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  age: number;
  country: string;
  university: string;
  academic_year: string;
  mlh_coc: boolean;
  mlh_dcp: boolean;
  share_address_mlh: boolean;
  share_address_sponsors: boolean;
  share_email_mlh: boolean;
  driving: boolean;
  travel_reimbursement: boolean;
  first_hackathon: boolean;
}