export interface ExtraCreditClassEntity {
  id: number;
  name: string;
  hackathonId?: string;
}

export interface ECClassAssignedUser {
  id: string;
  firstName: string;
  lastName: string;
}

export interface ECClassResponse extends ExtraCreditClassEntity {
  users: ECClassAssignedUser[];
}
