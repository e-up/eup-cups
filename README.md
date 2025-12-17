# eup-cups

TypeScript 实现的 IPP 客户端，附带 CUPS 扩展操作的轻量封装。目标是简单、稳定、向后兼容。

## 安装

```bash
npm install
```

至少需要 Node.js 18。

## 构建与类型检查

```bash
npm run build
npm run typecheck
```

## 快速开始

```ts
import { IppClient, CupsClient, parseResponse } from "./dist/index";

async function main() {
  const baseUrl = process.env.CUPS_URL || "http://localhost:631";

  // 使用 IPP 标准操作打印
  const ipp = new IppClient({ url: `${baseUrl}/printers/Test_Printer` });
  const doc = new TextEncoder().encode("Hello IPP\n");
  const printRes = await ipp.printJob(doc, "hello-job");
  console.log("Print-Job status:", printRes.statusCode);

  // 使用 CUPS 扩展获取打印机列表
  const cups = new CupsClient({ url: `${baseUrl}/` });
  const listRes = await cups.getPrinters(["printer-name", "printer-uri-supported"]);
  const parsed = parseResponse(listRes);
  console.log("Printers:", parsed.printers?.map(p => p.printerUriSupported));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
```

## 示例

项目提供了若干可运行示例（需先 `npm run build`）：

- `npm run example:get-printer-attributes`
- `npm run example:print-job`
- `npm run example:cups:get-default`
- `npm run example:cups:get-printers`
- `npm run example:cups:add-modify-printer`
- `npm run example:cups:group-print`

必要环境变量：

- `CUPS_URL`：CUPS 基础地址（默认 `http://localhost:631`）
- `CUPS_CLASS_NAME`：示例中使用的打印机类名
- `CUPS_MEMBER_URIS`：类成员的打印机 URI，逗号分隔

## 测试

```bash
npm test
npm run test:coverage
```

集成测试（需要本机 CUPS）：

- `npm run test:real` 使用本机 `http://localhost:631`，或通过 `CUPS_URL` 指定
- `npm run test:real:skip` 跳过集成测试（设置 `SKIP_CUPS_REAL=1`）

项目配置了全局覆盖率阈值，常规测试即可达到；若在 CI 场景下执行，请确保环境允许本地 HTTP 端口监听。

## API 概览

### IPP 标准操作（节选）

- 打印与作业：`printJob`、`createJob`、`sendDocument`、`printURI`、`sendURI`、`cancelJob`、`getJobs`、`getJobAttributes`、`closeJob`、`reprocessJob`、`resubmitJob`
- 打印机控制：`getPrinterAttributes`、`pausePrinter`、`resumePrinter`、`purgeJobs`、`enablePrinter`、`disablePrinter`、`holdNewJobs`、`releaseHeldNewJobs`
- 属性与订阅：`setPrinterAttributes`、`setJobAttributes`、`createPrinterSubscription`、`createJobSubscription`、`getSubscriptionAttributes`、`getSubscriptions`、`renewSubscription`、`cancelSubscription`、`getNotifications`

核心请求实现位于 `src/ipp/client.ts`，所有方法最终统一走 `request()`，简洁且可维护。

### CUPS 扩展操作（节选）

- 列表与默认：`getDefault`、`getPrinters`、`getDevices`、`getClasses`
- 管理：`addModifyPrinter`、`deletePrinter`、`addModifyClass`、`deleteClass`、`createLocalPrinter`
- 控制（兼容路径）：`acceptJobs`、`rejectJobs`、`getPPDs`、`getPPD`、`getDocument`

操作 ID 映射位于 `src/cups/ops.ts`。

## 设计原则

- 简化：薄封装，尽量只拼最小必要属性
- 稳定：不破坏现有用户空间；扩展操作保持返回 `IppResponse`
- 分层：业务逻辑在 service 层，组件与样式无关

## 许可证

本项目使用 [MIT](./LICENSE) 许可
