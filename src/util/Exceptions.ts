import { v4 as uuidv4 } from "uuid";
import { NestedError, toError } from "ts-nested-error";
import { StatusCodes } from "http-status-codes";
import httpStatusInfo from "http-status";

export interface ValidationMessage {
  fieldName: string;
  message: string;
  cause: Error;
}

export class BaseError extends NestedError {
  public readonly id: string;

  constructor(message: string, ...innerErrors: unknown[]) {
    super(message, ...innerErrors.map((v) => toError(v)));
    this.id = uuidv4();
  }
}

export class BusinessLogicError extends BaseError {
  constructor(message: string, ...innerErrors: unknown[]) {
    super(message, ...innerErrors);
  }
}

export class NotFoundError extends BusinessLogicError {
  constructor(message: string, ...innerErrors: unknown[]) {
    super(message, ...innerErrors);
  }
}

export class UnauthorizedError extends BusinessLogicError {
  constructor(message: string, ...innerErrors: unknown[]) {
    super(message, ...innerErrors);
  }
}

export class ValidationError extends BusinessLogicError {
  public readonly validationErrors: ValidationMessage[];

  constructor(
    message: string,
    validationErrors: ValidationMessage[],
    ...innerErrors: Error[]
  ) {
    super(message, ...innerErrors);
    this.validationErrors = validationErrors;
  }
}

export class HttpException extends BaseError {
  status: number;
  constructor(
    status: StatusCodes,
    message?: string,
    ...innerErrors: unknown[]
  ) {
    super(
      message || HttpException.getMessageFromStatus(status),
      ...innerErrors
    );
    this.status = status;
  }
  static getMessageFromStatus(status: StatusCodes): string {
    const msg = httpStatusInfo[status];
    return String(msg) || "Unknown HTTP Status";
  }
}