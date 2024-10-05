export type Token = {
  userName: string;
  token: string;
  userID: number;
};

export type Account = {
  name: string;
  clan: string;
  id: string;
  is_locked: boolean;
  avatar: string;
  chest_count: number;
  unavailable: boolean;
  vip: boolean;
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
  cookieyesID: string,
  log_cookie: string,
  PTBHSSID: string
}

export interface IStartCookiePayload {
  accountId: string,
  cookie: CookieData,
  url: string
}
