import { Map } from '../types';

export class AccessToken {
  request_time: number;
  expires_in: number;
  token_type: string;
  access_token: string;

  constructor(data: Map) {
    this.request_time = data.request_time;
    this.expires_in = data.expires_in;
    this.token_type = data.token_type;
    this.access_token = data.access_token;
  }
}
