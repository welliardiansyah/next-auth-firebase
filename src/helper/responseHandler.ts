import { Response } from 'express';

interface ResponseOptions {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data?: any;
  error?: any;
}

/**
 * Helper function to handle dynamic responses
 * @param res - Express response object
 * @param options - Dynamic response options
 */
export const handlerResponse = (res: Response, options: ResponseOptions = {}): void => {
  const {
    statusCode = 200,
    success = statusCode >= 200 && statusCode < 300,
    message = success ? 'Request processed successfully' : 'An error occurred',
    data = null,
    error = null,
  } = options;

  const responsePayload: any = {
    success,
    statusCode,
    message,
  };

  if (data !== null) responsePayload.data = data;
  if (error !== null) responsePayload.error = error;

  res.status(statusCode).json(responsePayload);
};
