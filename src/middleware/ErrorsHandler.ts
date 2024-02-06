import { NextFunction, Request, Response } from "express";
import { serializeError } from "serialize-error";
import { BaseError, ValidationMessage } from "../util/Exceptions";
import {
  BusinessLogicError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  HttpException,
} from "../util/Exceptions";
import { v4 as uuidv4 } from "uuid";
import { HttpError } from "express-openapi-validator/dist/framework/types";
import axios from "axios";
import httpStatus from "http-status";
import { NestedError } from "ts-nested-error";

export function ErrorsHandler(
  error: unknown,
  _request: Request,
  response: Response,
  next: NextFunction
): void {
  let status = 500;
  let errorType = "MiddlewareError";
  const errorReturn = new ErrorResult();

  if (error instanceof BaseError) {
    errorReturn.id = error.id;

    if (error instanceof HttpException) {
      status = error.status || status;
      errorType = "HttpException";
    } else if (error instanceof UnauthorizedError) {
      status = httpStatus.UNAUTHORIZED;
      errorType = "NotAuthenticatedError";
    } else if (error instanceof NotFoundError) {
      status = httpStatus.NOT_FOUND;
      errorType = "NotFoundError";
    } else if (error instanceof BusinessLogicError) {
      status = httpStatus.BAD_REQUEST;
      errorType = "BusinessLogicError";
    }

    if (error instanceof ValidationError) {
      errorReturn.mapValidationMessagesToFieldErrors(error.validationErrors);
      errorType = "ValidationError";
    }
  } else {
    errorReturn.id = uuidv4();
  }

  if (error instanceof HttpError) {
    status = error.status || status;
    errorType = "HttpError";
  } else if (axios.isAxiosError(error)) {
    status = error.response?.status || status;
  }

  if (error instanceof Error) {
    errorReturn.mapErrorFieldsToResult(error);
  } else {
    errorReturn.message = String(error);
  }

  const hasToJsonFunction =
    typeof (error as ObjectWithToJsonFunction)?.toJSON === "function";
  const errorDetails = {
    id: errorReturn.id,
    error: hasToJsonFunction ? error : serializeError(error),
    request: {
      path: _request.path,
      query: _request.query,
    },
    response: {
      status,
      body: errorReturn,
    },
  };

  console.error(errorType, JSON.stringify(errorDetails));
  response.status(status).send(errorReturn);
}

export class ErrorResult {
  id: string;
  message?: string;
  field_errors?: ErrorFieldErrorResult[];
  exception?: ErrorInformation;

  mapErrorFieldsToResult(error: Error): void {
    this.message = error?.message;
    this.exception = new ErrorInformation(error);
  }

  mapValidationMessagesToFieldErrors(
    validationErrors: ValidationMessage[]
  ): void {
    if (validationErrors && validationErrors.length > 0) {
      this.field_errors = [];
      for (const fieldError of validationErrors) {
        this.field_errors.push(new ErrorFieldErrorResult(fieldError));
      }
    }
  }
}

export class ErrorFieldErrorResult {
  location?: string;
  field?: string;
  reason?: string;
  caused_by?: ErrorInformation;

  constructor(fieldError: ValidationMessage) {
    this.location = "body";
    this.field = fieldError?.fieldName;
    this.reason = fieldError?.message;
    if (fieldError?.cause) {
      this.caused_by = new ErrorInformation(fieldError?.cause);
    }
  }
}

export class ErrorInformation {
  type?: string;
  message?: string;
  stack?: string;
  caused_by?: ErrorInformation[];

  constructor(error: Error) {
    this.type = error?.constructor?.name;
    this.message = error?.message;
    if (error instanceof NestedError) {
      this.addCausedBy(error);
    }
  }

  private addCausedBy(error: NestedError): void {
    if (error.innerErrors && error.innerErrors.length > 0) {
      this.caused_by = [];
      for (const innerError of error.innerErrors) {
        this.caused_by.push(new ErrorInformation(innerError));
      }
    }
  }
}

export interface ObjectWithToJsonFunction {
  toJSON(...args: unknown[]): Record<string, unknown>;
}
