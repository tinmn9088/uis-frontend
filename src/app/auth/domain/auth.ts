export interface Auth {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  permissions: string[];
}
