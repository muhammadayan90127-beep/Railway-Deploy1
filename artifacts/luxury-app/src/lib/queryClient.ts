import { QueryClient } from "@tanstack/react-query";
import { setAuthTokenGetter } from "@workspace/api-client-react";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      retry: 1,
    },
  },
});

let _tokenGetter: (() => string | null) | null = null;

export function setTokenGetter(fn: () => string | null) {
  _tokenGetter = fn;
  setAuthTokenGetter(fn);
}

export function getToken(): string | null {
  return _tokenGetter?.() ?? null;
}
