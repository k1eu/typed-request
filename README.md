# typed-request

`typed-request` is a utility library for working with Request,Responses and Fetches in Typescript.

In a nutshell, Typed Request allows you to:

- Fetch data from the server with strongly typed JSON responses with `tf` function
- Create TypedRequest and TypedResponse instances
- It is a drop-in replacement for Request and Response types

## Installation

```sh
npm install @k1eu/typed-request
```

```sh
yarn add @k1eu/typed-request
```

```sh
pnpm add @k1eu/typed-request
```

```sh
bun add @k1eu/typed-request
```

## Overview

Package can help you both on Frontend and Backend side of the application.
It provides `tf` function which is a drop in replacement for fetch but provides generic typing for the response.
For the headers it uses [SuperHeaders](https://github.com/mjackson/superheaders) which provides a typed API for the headers.

`tf` typed fetch function:

```ts
import { tf } from "@k1eu/typed-request";

type ResponseData = {
  data: {
    resourceId: string;
    title: string;
  };
};

export const handler = async (req: Request) => {
  const response = await tf<ResponseData>("https://example.com/api/resource", {
    headers: {
      contentType: "application/json",
    },
  }); // Typed with TypedResponse<ResponseData>
  const json = await response.json(); // Typed with ResponseData

  console.log(json.data.title); // ✅
  console.log(json.data.description); // ❌
};
```

TypedResponse and TypedRequest:

```ts
const Request = new TypedRequest<{
  data: {
    resourceId: string;
    title: string;
  };
}>("https://example.com");

const Response = new TypedResponse<{
  data: {
    resourceId: string;
    title: string;
  };
}>();

const response = await Request.json(); // Typed with { data: { resourceId: string; title: string; } }
const json = await Response.json(); // Typed with { data: { resourceId: string; title: string; } }
```

## License

See [LICENSE](https://github.com/k1eu/typed-request/blob/main/LICENSE)
