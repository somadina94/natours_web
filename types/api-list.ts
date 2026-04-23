export interface ApiListPayload<T> {
  status: string;
  results: number;
  data: { data: T[] };
}
