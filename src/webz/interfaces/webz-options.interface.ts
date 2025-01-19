export interface WebzCallbackData {
  received: number;
  remaining: number;
}

export interface WebzOptions {
  queryString?: string;
  callback?: (data: WebzCallbackData) => void;
}
