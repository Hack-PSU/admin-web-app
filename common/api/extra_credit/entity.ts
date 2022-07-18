export interface IExtraCreditClassEntity {
  uid: number;
  class_name: string;
}

export interface IExtraCreditClassCreateEntity {
  uid: string;
  className: string;
}

export interface IAssignExtraCreditClassEntity {
  classUid: string;
  userUid: string;
}

export interface IExtraCreditAssignmentEntity {
  uid: number;
  user_uid: string;
  class_uid: number;
}
