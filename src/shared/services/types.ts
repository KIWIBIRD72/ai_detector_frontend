export type ClusterResponseType<T> = {
  accuracy: number;
  total: number;
  page: number;
  page_size: number;
  data: T[];
};

export enum Label {
  HUMAN = 0,
  AI = 1,
}

export type ClusterType = {
  text: string;
  x: number;
  y: number;
  cluster: Label;
  true_label: Label;
};

export type GetAccuracyResponse = {
  accuracy: number;
};
