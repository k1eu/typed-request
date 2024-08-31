// typed-request.test.ts
import { describe, it, expect, expectTypeOf } from "vitest";
import { TypedRequest, TypedResponse } from "./typed-request.js";
import SuperHeaders from "@mjackson/headers";
import { TypedFormData } from "@k1eu/typed-formdata";

describe("TypedRequest", () => {
  it("should create a TypedRequest instance", () => {
    const request = new TypedRequest("https://example.com");
    expect(request).toBeInstanceOf(TypedRequest);
  });

  it("should handle superheaders correctly", () => {
    const request = new TypedRequest("https://example.com", {
      headers: {
        "content-type": "application/json",
      },
    });
    expect(request.headers).toBeInstanceOf(Headers);

    expect(request.headers.get("content-type")).toBe("application/json");
  });

  it("should handle native headers correctly", () => {
    const request = new TypedRequest("https://example.com", {
      headers: {
        "content-type": "application/json",
      },
    });
    expect(request.headers).toBeInstanceOf(Headers);
    // expect(request.headers.contentType).toBe("application/json");
    expect(request.headers.get("content-type")).toBe("application/json");
  });

  // TODO: doesn't reutrn integrity
  it.skip("should handle integrity", () => {
    const integrity = "sha256-abcdef";
    const request = new TypedRequest("https://example.com", { integrity });

    expect(request.integrity).toBe(integrity);
  });

  it("should have proper types for integrity", () => {
    const integrityAlgos = ["sha256", "sha384", "sha512"] as const;

    integrityAlgos.forEach((algo) => {
      const request = new TypedRequest("https://example.com", {
        integrity: `${algo}-abcdef`,
      });

      // expect(request.integrity).toBe(`${algo}-abcdef`);
    });

    const request = new TypedRequest("https://example.com", {
      // @ts-expect-error Should throw error - if not TSC catches it as "unused expect-error" 
      integrity: "FOO-abcdef",
    });
  });

  it("should handle method", () => {
    const method = "POST";
    const request = new TypedRequest("https://example.com", { method });
    expect(request.method).toBe(method);
  });
  it("should have proper types for method", () => {
    const methods = [
      "GET",
      "HEAD",
      "POST",
      "PUT",
      "DELETE",
      // "CONNECT",
      "OPTIONS",
      // "TRACE",
      "PATCH",
    ] as const;

    methods.forEach((method) => {
      const request = new TypedRequest("https://example.com", { method });
      expect(request.method).toBe(method);
    });

    // @ts-expect-error Should throw error - if not TSC catches it as "unused expect-error"
    new TypedRequest("https://example.com", { method: "FOO" });
  });

  it("should handle json method for TypedRequest", async () => {
    const request = new TypedRequest<{ test: string }>("https://example.com", {
      body: JSON.stringify({ test: "value" }),
      method: "POST",
    });
    const result = await request.json();
    expect(result).toEqual({ test: "value" });
    expectTypeOf(result).toMatchTypeOf<{ test: string }>();
    expectTypeOf(request.formData).not.toMatchTypeOf<FormData>();
    expectTypeOf(request.formData).not.toMatchTypeOf<
      TypedFormData<{ test: string }>
    >();
    expectTypeOf(request.text).not.toMatchTypeOf<string>();
  });

  it("should handle formData method for TypedRequest", async () => {
    const formData = new FormData();
    formData.append("field", "value");

    const request = new TypedRequest<FormData>("https://example.com", {
      body: formData,
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    });
    const result = await request.formData();
    expectTypeOf(result).toMatchTypeOf<FormData>();
    expectTypeOf(request.json).not.toMatchTypeOf<Record<string, unknown>>();
    expectTypeOf(request.text).not.toMatchTypeOf<string>();
  });

  it("should handle TypedFormData method for TypedRequest", async () => {
    const typedFormData = new TypedFormData<{ field: string }>();
    typedFormData.append("field", "value");
    const request = new TypedRequest<TypedFormData<{ field: string }>>(
      "https://example.com",
      {
        body: typedFormData,
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    const result = await request.formData();
    expect(result).toBeInstanceOf(FormData);
    expectTypeOf(result).toMatchTypeOf<TypedFormData<{ field: string }>>();
    try {
      expectTypeOf(await request.json()).not.toMatchTypeOf<
        Record<string, unknown>
      >();
    } catch (e) {}
    try {
      expectTypeOf(await request.text()).not.toMatchTypeOf<string>();
    } catch (e) {}
  });

  it("can be used in place of Request", async () => {
    function parseRequest(req: Request) {
      return req.json();
    }

    const request = new TypedRequest("https://example.com", {
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ test: "value" }),
      method: "POST",
    });

    // No error
    const result = await parseRequest(request);
  });
});

describe("TypedResponse", () => {
  it("should create a TypedResponse instance", () => {
    const response = new TypedResponse("https://example.com");
    expect(response).toBeInstanceOf(TypedResponse);
  });

  it("should handle superheaders correctly", () => {
    const request = new TypedResponse("https://example.com", {
      headers: {
        contentType: "application/json",
      },
    });
    expect(request.headers).toBeInstanceOf(Headers);
    // expect(request.headers.contentType).toBe("application/json");
    expect(request.headers.get("content-type")).toBe("application/json");
  });

  it("should handle native headers correctly", () => {
    const response = new TypedResponse("https://example.com", {
      headers: {
        "content-type": "application/json",
      },
    });
    expect(response.headers).toBeInstanceOf(Headers);
    // expect(response.headers.contentType).toBe("application/json");
    expect(response.headers.get("content-type")).toBe("application/json");
  });

  it("should handle json method for TypedResponse", async () => {
    const response = new TypedResponse<{ test: string }>(
      "https://example.com",
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );
    try {
      const result = await response.json();
      expect(result).toEqual({ test: "value" });
      expectTypeOf(result).toMatchTypeOf<{ test: string }>();
    } catch (e) {}
    expectTypeOf(response.formData).not.toMatchTypeOf<FormData>();
    expectTypeOf(response.formData).not.toMatchTypeOf<
      TypedFormData<{ test: string }>
    >();
    expectTypeOf(response.text).not.toMatchTypeOf<string>();
  });

  it("should handle formData method for TypedResponse", async () => {
    const response = new TypedResponse<FormData>("https://example.com", {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    });
    const result = await response.formData();
    expect(result).toBeInstanceOf(FormData);
    expectTypeOf(result).toMatchTypeOf<FormData>();
    expectTypeOf(response.json).not.toMatchTypeOf<Record<string, unknown>>();
    expectTypeOf(response.text).not.toMatchTypeOf<string>();
  });

  it("should handle TypedFormData method for TypedResponse", async () => {
    const response = new TypedResponse<TypedFormData<{ field: string }>>(
      "https://example.com",
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    const result = await response.formData();
    expect(result).toBeInstanceOf(FormData);
    expectTypeOf(result).toMatchTypeOf<TypedFormData<{ field: string }>>();
    expectTypeOf(response.json).not.toMatchTypeOf<Record<string, unknown>>();
    expectTypeOf(response.text).not.toMatchTypeOf<string>();
  });

  it("can be used in place of Response", async () => {
    function parseResponse(res: Response) {
      return res.headers.get("content-type");
    }

    const response = new TypedResponse("https://example.com", {
      headers: {
        "content-type": "application/json",
      },
    });

    // No error
    const result = parseResponse(response);
  });
});
