"use client";

import { FC, ReactNode } from "react";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import toast from "react-hot-toast";

let hasShownErrorToast = false;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
  },
  queryCache: new QueryCache({
    onError: () => {
      if (!hasShownErrorToast) {
        hasShownErrorToast = true;

        toast.error("Cannot load data. Try again later");

        setTimeout(() => {
          hasShownErrorToast = false;
        }, 3000);
      }
    },
  }),
});

if (typeof window !== "undefined") {
  const localStoragePersister = createSyncStoragePersister({
    storage: window.localStorage,
  });

  persistQueryClient({
    queryClient,
    persister: localStoragePersister,
    maxAge: 1000 * 60 * 10, // Максимальный срок кэша: 10 мин
  });
}

type TanstackProviderProps = { children: ReactNode };
export const TanstackProvider: FC<TanstackProviderProps> = ({ children }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
