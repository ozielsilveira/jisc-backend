export type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
};

export type ApiError = {
  code: string;
  message: string;
  statusCode: number;
};
