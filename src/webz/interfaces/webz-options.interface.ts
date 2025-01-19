export interface WebzCallbackData {
  received: number;
  remaining: number;
}

export interface WebzOptions {
  queryString?: string;
}

export interface WebzFetchAndStore extends WebzOptions {
  callback?: (data: WebzCallbackData) => void;
}
