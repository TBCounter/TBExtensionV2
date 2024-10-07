export type Token = {
  userName: string;
  token: string;
  userID: number;
};

export type Account = {
  avatar?: string;
  clan?: string;
  createdAt?: string;
  id: string;
  isTriumph?: boolean; // deprecated
  is_locked?: boolean; // deprecated
  login: string;
  name: string;
  node_url?: string; // deprecated
  node_urld_id?: string; // deprecated
  password: string; // unsafe
  updatedAt: string;
  userId: string; //same as user id
  vip: boolean;

  logs?: Array<{
    message: string;
    timestamp: string;
    _id: string;
  }>;
  session?: ChestStatuses;

  // chest_count: number;
  // unavailable: boolean;
};

export type NodeStatuses = { idle: number; busy: number };

type chestStatus =
  | 'CREATED'
  | 'UPLOADED'
  | 'PROCESSING'
  | 'PROCESSED'
  | 'ERROR';

export type ChestStatuses = {
  [key in chestStatus]: number;
};

export type SessionStatus = {
  _id: string;
  session_id: string;
  start_time: string;
  status: 'DONE' | 'ERROR' | 'ACTIVE';
  chestStatusCounts: ChestStatuses;
};

export type Chest = {
  check_needed: null | boolean;
  chest_name: string;
  chest_type: string;
  got_at: string;
  id: string;
  opened_in: string;
  path: string;
  player: string;
};

export type TimePickerType = {
  account_id: number;
  from: string;
  to: string;
  from_time: string;
  to_time: string;
};

export interface ILoginCreds {
  email: string;
  password: string;
}
export type CookieData = {
  cookieyesID: string;
  log_cookie: string;
  PTBHSSID: string;
};

export interface IStartCookiePayload {
  accountId: string;
  cookie: CookieData;
  url: string;
}
