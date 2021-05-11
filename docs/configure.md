# 配置文档

## 全部配置

```yml
# serverless.yml

app: appDemo # (可选) 用于记录组织信息. 默认与name相同，必须为字符串
stage: dev # (可选) 用于区分环境信息，默认值是 dev

component: asw # (必选) 组件名称
name: asw-demo # 必选) 组件实例名称.

inputs:
  src:
    src: ./ # 指定当前需要上传的包含工作流配置文件的目录
    exclude:
      - .env
  region: ap-guangzhou # 云函数所在区域
  name: asw-demo
  definition: ./workflow.json
  chineseName: chineseName
  description: This is asw demo.
  type: STANDARD
  role: asw-role
  enableCls: false
  input: '{"key":"value"}'
```

## inputs 配置参数

主要的参数

| 参数名称    | 必选 | 类型        |         默认值          | 描述                                       |
| ----------- | :--: | :---------- | :---------------------: | :----------------------------------------- |
| region      |  否  | string      |     `ap-guangzhou`      | 工作流所在区域                             |
| src         |  是  | [Src](#Src) |                         | 指定当前需要上传的包含工作流配置文件的目录 |
| name        |  是  | string      |                         | 工作流名称                                 |
| definition  |  是  | string      |                         | 工作流配置 json 文件路径，或者 JSON 字符串 |
| chineseName |  否  | string      |      `serverless`       | 中文名称                                   |
| description |  否  | string      | `Created By Serverless` | 备注                                       |
| type        |  否  | string      |       `STANDARD`        | 工作流类型                                 |
| role        |  否  | string      |                         | 运行角色，如果不配置，会自动创建           |
| enableCls   |  否  | boolean     |         `false`         | 是否启动日志投递                           |
| input       |  否  | string      |          `''`           | 默认运行参数                               |

> 注意：如果指定 `definition` 为 json 文件路径，必须制定 src.src 为该 json 文件目录，如果 `definition` 为 JSON 字符串，可以不配置 `src`

## 权限说明

通常 `asw` 组件的运行依赖 `SLS_QcsRole` 角色授权操作云端资源，如果需要使用本组件，需要给 `SLS_QcsRole` 角色添加 `QcloudASWFullAccess` 策略。

使用此组件时，用户一般需要配置 `role` 参数，来指定创建的工作流依赖运行的角色，如果不配置该参数，组件会尝试创建符合条件的角色（角色命名规则为 `[工作流名称]_[账号AppId]_[8位随机应为字符]`），但是需要保证 `SLS_QcsRole` 角色含有创建角色策略 `QcloudCamRoleFullAccess`。

## Src

项目代码配置

| 参数名称 | 是否必选 |   类型   | 默认值 | 描述                                       |
| -------- | :------: | :------: | :----: | :----------------------------------------- |
| src      |    否    |  string  |        | json 配置文件路径                          |
| exclude  |    否    | string[] |        | 不包含的文件或路径, 遵守 [glob 语法][glob] |

<!-- links -->

[glob]: https://github.com/isaacs/node-glob
