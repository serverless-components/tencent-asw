export interface KeyValue {
  key: string;
  value: string;
}

export interface Inputs {
  region?: string;
  src?: string;
  definition: string;
  name: string;
  role?: string;
  type?: string;
  chineseName?: string;
  description?: string;
  enableCls?: boolean;
  input?: string;

  appId?: string;

  executeName?: string;

  srcOriginal?: {
    bucket: string;
    object: string;
  };
}
