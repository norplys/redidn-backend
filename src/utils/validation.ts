import { z } from 'zod';
import type { ZodError } from 'zod';

export const validStringSchema = z.string().trim().min(1);

export function formatZodError(error: ZodError): string {
  const errorArray = error.errors;

  const formatError = errorArray.map(({ message, path: [name] }) => {
    return `${name} ${message}`;
  });

  return formatError.join(', ');
}
