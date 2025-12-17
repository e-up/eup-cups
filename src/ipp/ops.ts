/**
 * IPP 标准操作枚举（OperationId）
 */
export enum IppOperationId {
  PrintJob = 0x0002,
  PrintURI = 0x0003,
  ValidateJob = 0x0004,
  CreateJob = 0x0005,
  SendDocument = 0x0006,
  SendURI = 0x0007,
  CancelJob = 0x0008,
  GetJobAttributes = 0x0009,
  GetJobs = 0x000a,
  GetPrinterAttributes = 0x000b,
  HoldJob = 0x000c,
  ReleaseJob = 0x000d,
  RestartJob = 0x000e,
  PausePrinter = 0x0010,
  ResumePrinter = 0x0011,
  PurgeJobs = 0x0012,
  SetPrinterAttributes = 0x0013,
  SetJobAttributes = 0x0014,
  CreatePrinterSubscription = 0x0016,
  CreateJobSubscription = 0x0017,
  GetSubscriptionAttributes = 0x0018,
  GetSubscriptions = 0x0019,
  RenewSubscription = 0x001a,
  CancelSubscription = 0x001b,
  GetNotifications = 0x001c,
  EnablePrinter = 0x0022,
  DisablePrinter = 0x0023,
  HoldNewJobs = 0x0025,
  ReleaseHeldNewJobs = 0x0026,
  ReprocessJob = 0x002c,
  CancelJobs = 0x0038,
  CancelMyJobs = 0x0039,
  ResubmitJob = 0x003a,
  CloseJob = 0x003b
}

export type IppOperationName =
  | "Print-Job"
  | "Print-URI"
  | "Validate-Job"
  | "Create-Job"
  | "Send-Document"
  | "Send-URI"
  | "Cancel-Job"
  | "Get-Job-Attributes"
  | "Get-Jobs"
  | "Get-Printer-Attributes"
  | "Hold-Job"
  | "Release-Job"
  | "Restart-Job"
  | "Pause-Printer"
  | "Resume-Printer"
  | "Purge-Jobs"
  | "Set-Printer-Attributes"
  | "Set-Job-Attributes"
  | "Create-Printer-Subscription"
  | "Create-Job-Subscription"
  | "Get-Subscription-Attributes"
  | "Get-Subscriptions"
  | "Renew-Subscription"
  | "Cancel-Subscription"
  | "Get-Notifications"
  | "Enable-Printer"
  | "Disable-Printer"
  | "Hold-New-Jobs"
  | "Release-Held-New-Jobs"
  | "Reprocess-Job"
  | "Cancel-Jobs"
  | "Cancel-My-Jobs"
  | "Resubmit-Job"
  | "Close-Job";

/**
 * IPP 操作名称到 OperationId 的映射（仅供兼容/日志）
 */
export const KnownOperationIds: Record<IppOperationName, number | undefined> = {
  "Print-Job": IppOperationId.PrintJob,
  "Print-URI": IppOperationId.PrintURI,
  "Validate-Job": IppOperationId.ValidateJob,
  "Create-Job": IppOperationId.CreateJob,
  "Send-Document": IppOperationId.SendDocument,
  "Send-URI": IppOperationId.SendURI,
  "Cancel-Job": IppOperationId.CancelJob,
  "Get-Job-Attributes": IppOperationId.GetJobAttributes,
  "Get-Jobs": IppOperationId.GetJobs,
  "Get-Printer-Attributes": IppOperationId.GetPrinterAttributes,
  "Hold-Job": IppOperationId.HoldJob,
  "Release-Job": IppOperationId.ReleaseJob,
  "Restart-Job": IppOperationId.RestartJob,
  "Pause-Printer": IppOperationId.PausePrinter,
  "Resume-Printer": IppOperationId.ResumePrinter,
  "Purge-Jobs": IppOperationId.PurgeJobs,
  "Set-Printer-Attributes": IppOperationId.SetPrinterAttributes,
  "Set-Job-Attributes": IppOperationId.SetJobAttributes,
  "Create-Printer-Subscription": IppOperationId.CreatePrinterSubscription,
  "Create-Job-Subscription": IppOperationId.CreateJobSubscription,
  "Get-Subscription-Attributes": IppOperationId.GetSubscriptionAttributes,
  "Get-Subscriptions": IppOperationId.GetSubscriptions,
  "Renew-Subscription": IppOperationId.RenewSubscription,
  "Cancel-Subscription": IppOperationId.CancelSubscription,
  "Get-Notifications": IppOperationId.GetNotifications,
  "Enable-Printer": IppOperationId.EnablePrinter,
  "Disable-Printer": IppOperationId.DisablePrinter,
  "Hold-New-Jobs": IppOperationId.HoldNewJobs,
  "Release-Held-New-Jobs": IppOperationId.ReleaseHeldNewJobs,
  "Reprocess-Job": IppOperationId.ReprocessJob,
  "Cancel-Jobs": IppOperationId.CancelJobs,
  "Cancel-My-Jobs": IppOperationId.CancelMyJobs,
  "Resubmit-Job": IppOperationId.ResubmitJob,
  "Close-Job": IppOperationId.CloseJob
};
