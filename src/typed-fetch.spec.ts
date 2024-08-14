import { describe, it, expect, vi, Mock, expectTypeOf } from "vitest";
import { tf } from "./typed-fetch.js";
import SuperHeaders from "@mjackson/headers";

global.fetch = vi.fn();

describe("tf (typed fetch)", () => {
  it("should have proper types for the response", async () => {
    const mockResponse = new Response();
    (global.fetch as Mock).mockResolvedValue(mockResponse);

    const response = await tf<string>("https://example.com");

    try {
      const text = await response.text();
      expectTypeOf(text).toMatchTypeOf<string>();
    } catch (e) {}

    try {
      const json = await response.json();
      expectTypeOf(json).toMatchTypeOf<never>();
    } catch (e) {}

    try {
      const formData = await response.formData();
      expectTypeOf(formData).toMatchTypeOf<never>();
    } catch (e) {}

    expect(response).toBeInstanceOf(Response);
  });

  it("should use SuperHeaders for the headers option", async () => {
    await tf("https://example.com", {
      headers: { contentType: "application/json" },
    });

    expect(global.fetch).toHaveBeenCalledWith("https://example.com", {
      headers: new SuperHeaders({ contentType: "application/json" }),
    });
  });
});
