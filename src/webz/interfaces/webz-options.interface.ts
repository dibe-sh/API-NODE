export interface WebzCallbackData {
  received: number;
  remaining: number;
}

// TODO: Support more options for filtering and decouple options from query string
export interface WebzOptions {
  queryString?: string;
}

export interface WebzFetchAndStore extends WebzOptions {
  callback?: (data: WebzCallbackData) => void;
}
