import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { NestedError, toError } from "ts-nested-error";
import { serializeError } from "serialize-error";

export type AsyncRequestMethod = (
  req: Request,
  res: Response,
  ...args: unknown[]
) => Promise<unknown>;

export type AsyncRequestProcessorCallback = (
  isError: boolean,
  errorOrReturn: unknown,
  error?: Error
) => void;

/**
 * Just a place to put "shared" or "common" functions that controllers
 * will likely need.
 */
export abstract class BaseController {
  public processAsyncRequestMethod(
    req: Request,
    res: Response,
    next: NextFunction,
    fn: AsyncRequestMethod,
    callback?: AsyncRequestProcessorCallback,
    ...args: unknown[]
  ): void {
    fn(req, res, next, ...args)
      .then((returnValue) => {
        const headersSent = res.headersSent;
        const contentSent = res.writableEnded;
        const data = returnValue;

        if (data) {
          if (!headersSent) {
            res.status(StatusCodes.OK);
          }
          if (req.method === "POST") {
            res.status(StatusCodes.CREATED);
          }
          if (!contentSent) {
            res.send(data);
          }
        } else if (!headersSent) {
          res.sendStatus(StatusCodes.NO_CONTENT);
        }

        this.callCallback(callback, false, returnValue);
      })
      .catch((err) => {
        try {
          next(err);
        } catch (anotherErr) {
          err = new NestedError("Error when processing next function.", err);
        } finally {
          console.warn(
            "asyncRequestError",
            JSON.stringify(serializeError(err))
          );
          this.callCallback(callback, true, err);
        }
      });
  }

  protected callCallback(
    callback: AsyncRequestProcessorCallback,
    isError: boolean,
    returnValue: unknown
  ): void {
    if (callback) {
      try {
        callback(isError, returnValue, toError(returnValue));
      } catch (err) {
        const callbackError = new NestedError(
          "Error when processing callback function, will ignore.",
          returnValue
        );
        console.warn(
          "asyncRequestProcessorCallbackError",
          "Error when processing callback function: will ignore",
          serializeError(callbackError)
        );
      }
    }
  }
}
