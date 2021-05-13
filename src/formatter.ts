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

    const definitionPath = join(sourcePath, inputs.definition);

    definition = readFileSync(definitionPath, 'utf-8');
  }

  // read input json
  let inputStr = '';
  if (inputs.input) {
    try {
      JSON.parse(inputs.input);
      inputStr = inputs.input;
    } catch (e) {
      const sourcePath = await instance.unzip(inputs.src!);

      const inputPath = join(sourcePath, inputs.input);

      inputStr = readFileSync(inputPath, 'utf-8');
    }
  }

  const newInputs: Inputs = Object.assign(inputs, {
    definition: definition,
    name: inputs.name,
    roleArn: inputs.roleArn,
    type: inputs.type || CONFIGS.type,
    chineseName: inputs.chineseName || CONFIGS.chineseName,
    description: inputs.description || CONFIGS.description,
    enableCls: inputs.enableCls ?? CONFIGS.enableCls,
    input: inputStr,
  });

  return {
    region,
    newInputs,
  };
};
