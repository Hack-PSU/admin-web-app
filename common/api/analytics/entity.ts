interface CountsResponse {
  count: number;
}

interface RegistrationCounts extends CountsResponse {
  id: string;
  name: string;
}

interface GenderCounts extends CountsResponse {
  gender: string;
}

interface RaceCounts extends CountsResponse {
  race: string;
}

interface AcademicYearCounts extends CountsResponse {
  academicYear: string;
}

interface CodingExpCounts extends CountsResponse {
  codingExperience: string;
}

export interface AnalyticsSummaryResponse {
  registrations: RegistrationCounts[];
  gender: GenderCounts[];
  race: RaceCounts[];
  academicYear: AcademicYearCounts[];
  codingExp: CodingExpCounts[];
}
