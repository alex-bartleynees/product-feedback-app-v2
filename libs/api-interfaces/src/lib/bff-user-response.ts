export interface BffClaim {
  type: string;
  value: string;
}

export interface BffUserResponse {
  isAuthenticated: boolean;
  claims: BffClaim[];
}
