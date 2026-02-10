// Stub tRPC client - replace with actual tRPC setup when backend is ready
// This provides a mock implementation so the UI compiles and renders

function createNoopQuery() {
  return {
    useQuery: (_input?: any, _opts?: any) => ({
      data: undefined,
      isLoading: false,
      error: null,
      refetch: () => Promise.resolve({ data: undefined }),
    }),
    useMutation: (_opts?: any) => ({
      mutate: (..._args: any[]) => {},
      mutateAsync: (..._args: any[]) => Promise.resolve(undefined),
      isPending: false,
      isError: false,
      error: null,
    }),
  };
}

function createProxy(): any {
  return new Proxy(
    {},
    {
      get: (_target, _prop) => {
        return createProxy();
      },
      apply: () => {
        return createNoopQuery();
      },
    }
  );
}

// Create a deeply nested proxy that returns noop query/mutation hooks
export const trpc: any = new Proxy(
  {},
  {
    get: (_target, prop) => {
      if (prop === "useQuery" || prop === "useMutation") {
        return createNoopQuery()[prop as keyof ReturnType<typeof createNoopQuery>];
      }
      // Return another proxy for nested access like trpc.ordensServico.getCompleta
      return new Proxy(
        {},
        {
          get: (_t, innerProp) => {
            if (innerProp === "useQuery") {
              return (_input?: any, _opts?: any) => ({
                data: undefined,
                isLoading: false,
                error: null,
                refetch: () => Promise.resolve({ data: undefined }),
              });
            }
            if (innerProp === "useMutation") {
              return (_opts?: any) => ({
                mutate: (..._args: any[]) => {},
                mutateAsync: (..._args: any[]) => Promise.resolve(undefined),
                isPending: false,
                isError: false,
                error: null,
              });
            }
            return new Proxy(
              {},
              {
                get: (_t2, deepProp) => {
                  if (deepProp === "useQuery") {
                    return (_input?: any, _opts?: any) => ({
                      data: undefined,
                      isLoading: false,
                      error: null,
                      refetch: () => Promise.resolve({ data: undefined }),
                    });
                  }
                  if (deepProp === "useMutation") {
                    return (_opts?: any) => ({
                      mutate: (..._args: any[]) => {},
                      mutateAsync: (..._args: any[]) => Promise.resolve(undefined),
                      isPending: false,
                      isError: false,
                      error: null,
                    });
                  }
                  return createNoopQuery();
                },
              }
            );
          },
        }
      );
    },
  }
);
