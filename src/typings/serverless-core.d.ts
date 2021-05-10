declare module '@serverless/core' {
  declare class Component<S> {
    state: S;
    credentials: {
      tencent: {
        tmpSecrets: {
          TmpSecretId: string;
          TmpSecretKey: string;
          Token: string;
          appId: string;
        };
      };
    };

    save();
    async unzip(p: string): Promise<string>;
  }
}
