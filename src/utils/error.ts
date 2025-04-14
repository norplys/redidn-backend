import type { ZodError } from 'zod';

export class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function formatZodError(error: ZodError): string {
  const errorArray = error.errors;

  const formatError = errorArray.map(({ message, path: [name] }) => {
    return `${name} ${message}`;
  });

  return formatError.join(', ');
}

