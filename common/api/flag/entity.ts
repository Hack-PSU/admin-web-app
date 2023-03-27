export enum SocketRoom {
  ADMIN = "ADMIN",
  MOBILE = "MOBILE",
}

export interface FlagsEntity {
  name: string;
  isEnabled: boolean;
}

export interface ToggleFlagEntity extends FlagsEntity {
  broadcast?: SocketRoom;
}
