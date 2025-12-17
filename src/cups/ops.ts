/**
 * CUPS 扩展操作枚举（OperationId）
 */
export enum CupsOperationId {
  GetDefault = 0x4001,
  GetPrinters = 0x4002,
  AddModifyPrinter = 0x4003,
  DeletePrinter = 0x4004,
  GetClasses = 0x4005,
  AddModifyClass = 0x4006,
  DeleteClass = 0x4007,
  AcceptJobs = 0x4008, // deprecated
  RejectJobs = 0x4009, // deprecated
  SetDefault = 0x400a,
  GetDevices = 0x400b,
  GetPPDs = 0x400c,
  MoveJob = 0x400d,
  AuthenticateJob = 0x400e,
  GetPPD = 0x400f,
  GetDocument = 0x4027,
  CreateLocalPrinter = 0x4028
}

export type CupsOperationName =
  | "CUPS-Get-Default"
  | "CUPS-Get-Printers"
  | "CUPS-Add-Modify-Printer"
  | "CUPS-Delete-Printer"
  | "CUPS-Get-Classes"
  | "CUPS-Add-Modify-Class"
  | "CUPS-Delete-Class"
  | "CUPS-Accept-Jobs"
  | "CUPS-Reject-Jobs"
  | "CUPS-Set-Default"
  | "CUPS-Get-Devices"
  | "CUPS-Get-PPDs"
  | "CUPS-Move-Job"
  | "CUPS-Authenticate-Job"
  | "CUPS-Get-PPD"
  | "CUPS-Get-Document"
  | "CUPS-Create-Local-Printer";

/**
 * CUPS 操作名称到 OperationId 的映射（仅供兼容/日志）
 */
export const KnownCupsOperationIds: Record<CupsOperationName, number> = {
  "CUPS-Get-Default": CupsOperationId.GetDefault,
  "CUPS-Get-Printers": CupsOperationId.GetPrinters,
  "CUPS-Add-Modify-Printer": CupsOperationId.AddModifyPrinter,
  "CUPS-Delete-Printer": CupsOperationId.DeletePrinter,
  "CUPS-Get-Classes": CupsOperationId.GetClasses,
  "CUPS-Add-Modify-Class": CupsOperationId.AddModifyClass,
  "CUPS-Delete-Class": CupsOperationId.DeleteClass,
  "CUPS-Accept-Jobs": CupsOperationId.AcceptJobs,
  "CUPS-Reject-Jobs": CupsOperationId.RejectJobs,
  "CUPS-Set-Default": CupsOperationId.SetDefault,
  "CUPS-Get-Devices": CupsOperationId.GetDevices,
  "CUPS-Get-PPDs": CupsOperationId.GetPPDs,
  "CUPS-Move-Job": CupsOperationId.MoveJob,
  "CUPS-Authenticate-Job": CupsOperationId.AuthenticateJob,
  "CUPS-Get-PPD": CupsOperationId.GetPPD,
  "CUPS-Get-Document": CupsOperationId.GetDocument,
  "CUPS-Create-Local-Printer": CupsOperationId.CreateLocalPrinter
};
