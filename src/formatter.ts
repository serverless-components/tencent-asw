import { join } from 'path';
import { readFileSync } from 'fs';
import { Component } from '@serverless/core';
import { Inputs, State } from './interface';
import { CONFIGS } from './config';

export const formatInputs = async (inputs: Inputs, instance: Component<State>) => {
  const region = inputs.region ?? CONFIGS.region;

  // read workflow json
  let definition = '';
  try {
    JSON.parse(inputs.definition);
    ({ definition } = inputs);
  } catch (e) {
    const sourcePath = await instance.unzip(inputs.src!);
    console.log('sourcePath', sourcePath);

    const definitionPath = join(sourcePath, inputs.definition);
    console.log('definitionPath', definitionPath);

    definition = readFileSync(definitionPath, 'utf-8');
  }

  const newInputs: Inputs = Object.assign(inputs, {
    definition: definition,
    name: inputs.name,
    roleArn: inputs.roleArn,
    type: inputs.type || CONFIGS.type,
    chineseName: inputs.chineseName || CONFIGS.chineseName,
    description: inputs.description || CONFIGS.description,
    enableCls: inputs.enableCls ?? CONFIGS.enableCls,
    input: inputs.input,
  });

  return {
    region,
    newInputs,
  };
};
