export type Framework = 'asw';

export interface ComponentConfig {
  type: string;
  name: string;
  version: string;
  author: string;
  org: string;
  description: string;
  keywords: string;
  repo: string;
  readme: string;
  license: string;
  webDeployable: boolean;
  src: string;

  actions?: Record<string, any>;
}

export interface SrcObject {
  src?: string;
  dist?: string;
  hook?: string;
  exclude?: string[];
  targetDir?: string;
  bucket?: string;
  object?: string;
}

export type InputsSrc = string | SrcObject;

export interface ServerlessConfig {
  org?: string;
  app?: string;
  stage?: string;

  component: string;
  name: string;

  inputs: { src?: InputsSrc } & Record<string, any>;
}
