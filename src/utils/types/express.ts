type ResponseWithMessageOrData<T = unknown> = {
  message?: string;
  data?: T;
};

export type CommonResponse<
  T = unknown,
  U extends Record<string, unknown> | void = void
> = U extends void
  ? ResponseWithMessageOrData<T>
  : U & ResponseWithMessageOrData<T>;
