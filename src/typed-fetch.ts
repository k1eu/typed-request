import type { TypedFormData } from "@k1eu/typed-formdata";
import { TypedRequestInit, TypedResponse } from "./typed-request.js";
import SuperHeaders from "@mjackson/headers";

export function tf<
  T extends Record<string, unknown> | FormData | TypedFormData<any>
>(url: string, init?: TypedRequestInit) {
  if (init?.headers) {
    init.headers = new SuperHeaders(init.headers);
  }

  return fetch(url, init) as Promise<TypedResponse<T>>;
}
