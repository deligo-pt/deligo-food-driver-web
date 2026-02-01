export type TMeta = {
  page: number;
  limit: number;
  totalPage: number;
  total: number;
};

export type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
  meta?: TMeta;
  error?: unknown;
};
export type TGeoJSONPoint = {
  type: 'Point';
  coordinates: [number, number];
  geoAccuracy?: number;
  heading?: number;
  speed?: number;
  isMocked?: boolean;
  lastLocationUpdate: Date;
};