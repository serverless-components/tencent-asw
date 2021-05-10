import { Component } from '@serverless/core';
import { Asw } from 'tencent-component-toolkit';
import { ApiTypeError } from 'tencent-component-toolkit/lib/utils/error';
import { formatInputs } from './formatter';
import { State, Inputs, Outputs } from './interface';
import { getType } from './utils';

export class ServerlessComponent extends Component<State> {
  getCredentials() {
    const { tmpSecrets } = this.credentials.tencent;

    if (!tmpSecrets || !tmpSecrets.TmpSecretId) {
      throw new ApiTypeError(
        'CREDENTIAL',
        '无法获取授权密钥信息，账号可能为子账户，并且没有角色 SLS_QcsRole 的权限，请确认角色 SLS_QcsRole 是否存在，参考 https://cloud.tencent.com/document/product/1154/43006',
      );
    }

    return {
      SecretId: tmpSecrets.TmpSecretId,
      SecretKey: tmpSecrets.TmpSecretKey,
      Token: tmpSecrets.Token,
    };
  }

  getAppId() {
    return this.credentials.tencent.tmpSecrets.appId;
  }

  async deploy(inputs: Inputs) {
    console.log(`正在创建工作流`);

    const credentials = this.getCredentials();

    inputs.appId = this.getAppId();
    const { region, newInputs } = await formatInputs(inputs, this);

    const asw = new Asw(credentials, region);

    const { state } = this;
    let detail = null;

    let outputs: Outputs;

    if (state.resourceId) {
      detail = await asw.get(state.resourceId);
    }

    // 更新
    if (detail) {
      outputs = await asw.update({
        ...newInputs,
        resourceId: state.resourceId,
      });
    } else {
      // 创建
      outputs = await asw.create(newInputs);
    }

    outputs.region = region;

    this.state = outputs;

    return outputs;
  }

  async remove() {
    console.log(`正在移除工作流`);

    const { state } = this;
    const { region, resourceId } = state;

    const credentials = this.getCredentials();

    const asw = new Asw(credentials, region);

    await asw.delete(resourceId);

    this.state = {} as State;
  }

  async execute(inputs: Inputs) {
    console.log(`正在运行工作流`);

    const { state } = this;
    const { region, resourceId } = state;

    const credentials = this.getCredentials();

    const asw = new Asw(credentials, region);

    const res = await asw.execute({
      resourceId,
      input: getType(inputs.input) === 'Object' ? JSON.stringify(inputs.input) : inputs.input,
    });

    return res;
  }

  async stop(inputs: Inputs) {
    console.log(`正在停止工作流`);

    const { state } = this;
    const { region } = state;

    const credentials = this.getCredentials();

    const asw = new Asw(credentials, region);

    const res = await asw.stop(inputs.executeName!);

    return res;
  }
}
