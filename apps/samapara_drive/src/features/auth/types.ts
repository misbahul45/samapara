export type User = {
  id: string;
  name: string;
  email: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};
