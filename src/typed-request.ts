import type { TypedFormData } from "@k1eu/typed-formdata";
import type { SuperHeadersInit } from "@mjackson/headers";
import SuperHeaders from "@mjackson/headers";
import { b } from "vitest/dist/chunks/suite.CcK46U-P.js";

// https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#integrity
type IntegrityAlgo = "sha256" | "sha384" | "sha512";

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
type RequestMethod =
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "DELETE"
  // | "CONNECT"
  | "OPTIONS"
  // | "TRACE"
  | "PATCH";

type FormDataInReqeuest<T> = T extends TypedFormData<infer U>
  ? Promise<TypedFormData<U>>
  : T extends FormData
  ? Promise<FormData>
  : never;

export type TypedRequestInit = Omit<RequestInit, "integrity" | "method"> & {
  headers?: SuperHeadersInit;
  integrity?: `${IntegrityAlgo}-${string}`;
  method?: RequestMethod;
};

type TypedResponseInit = ResponseInit & {
  headers?: SuperHeadersInit;
};

type JSONInResponse<T> = T extends FormData | string ? never : Promise<T>;
type TextInResponse<T> = T extends string ? Promise<T> : never;

export class TypedResponse<
  T extends
    | Record<string, unknown>
    | FormData
    | TypedFormData<any>
    | string = {}
> extends Response {
  response: Response;
  constructor(url?: string, init?: TypedResponseInit) {
    if (init?.headers) {
      init.headers = new SuperHeaders(init.headers);
    }

    super(url, init);
    this.response = new Response(url, init);
  }

  public json(): JSONInResponse<T> {
    return this.response.json() as JSONInResponse<T>;
  }

  public text(): TextInResponse<T> {
    return this.response.text() as TextInResponse<T>;
  }

  formData(): FormDataInReqeuest<T> {
    return this.response.formData() as FormDataInReqeuest<T>;
  }
}

export class TypedRequest<
  T extends
    | Record<string, unknown>
    | FormData
    | TypedFormData<any>
    | string = {}
> extends Request {
  request: Request;
  constructor(url: string, init?: TypedRequestInit) {
    if (init?.headers) {
      init.headers = new SuperHeaders(init.headers);
    }
    super(url, init);

    this.request = new Request(url, init);
  }

  json(): JSONInResponse<T> {
    return this.request.json() as JSONInResponse<T>;
  }

  text(): TextInResponse<T> {
    return this.request.text() as TextInResponse<T>;
  }

  formData(): FormDataInReqeuest<T> {
    return this.request.formData() as FormDataInReqeuest<T>;
  }
}
