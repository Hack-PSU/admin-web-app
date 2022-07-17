export interface IExtraCreditClassEntity {
  uid: number;
  class_name: string;
}

export interface IExtraCreditClassCreateEntity {
  className: string;
}

export interface IExtraCreditAssignmentEntity {
  uid: number;
  user_uid: string;
  class_uid: number;
}
