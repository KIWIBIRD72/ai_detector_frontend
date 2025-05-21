import { useInfiniteQuery } from "@tanstack/react-query";
import { Service } from "./shared/services";
import { useState } from "react";
import { ClusteringMethod } from "./shared/services/types";
import { ClusterStats } from "./components/ClusterStats";
import { ClusterChart } from "./components/ClusterChart";
import { Tabs } from "./shared/ui/Tabs";
import { AnimatePresence, motion } from "motion/react";
import { Loader } from "./shared/ui/Loader";
import { SourceLinks } from "./components/SourceLinks";

export const App = () => {
  const [method, setMethod] = useState(ClusteringMethod.FUZZY);
  const [nClusters, setNClusters] = useState(2);

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ["clusters", method, nClusters],
      initialPageParam: 1,
      queryFn: ({ pageParam = 1 }) => {
        switch (method) {
          case ClusteringMethod.K_MEANS:
            return Service.getKmeansClusters(pageParam, 200, nClusters);
          case ClusteringMethod.FUZZY:
            return Service.getFuzzyClusters(pageParam, 200, nClusters);
          case ClusteringMethod.CNN:
            return Service.getCnnClusters(pageParam, 200, nClusters);
        }
      },
      getNextPageParam: (lastPage, allPages) => {
        const total = lastPage.total ?? 0;
        const loaded = allPages.flatMap((p) => p.data).length;
        return loaded < total ? allPages.length + 1 : undefined;
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    });

  const allData = data?.pages.flatMap((p) => p.data) ?? [];

  const handleMethodChange = (state: ClusteringMethod) => {
    setMethod(state);
    refetch();
  };

  return (
    <section className="mx-auto max-w-[1100px]">
      <AnimatePresence>
        {isFetching && !isFetchingNextPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-white/50"
          >
            <Loader />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-4 p-6">
        <h2 className="mb-4 text-2xl font-semibold">Кластеризация AI & Human текстов</h2>

        <Tabs
          id={"clustering method select"}
          tabs={[
            { id: 1, label: "KMeans", data: ClusteringMethod.K_MEANS },
            { id: 2, label: "Fuzzy", data: ClusteringMethod.FUZZY },
            { id: 3, label: "CNN", data: ClusteringMethod.CNN },
          ]}
          onChange={(data) => handleMethodChange(data.data)}
          className="max-w-[400px]"
        />

        <div className="flex gap-2">
          <Tabs
            id={"clusters number"}
            tabs={[
              { id: 1, label: "2 clusters", data: 2 },
              { id: 2, label: "5 clusters", data: 5 },
            ]}
            onChange={(data) => setNClusters(data.data)}
            className="max-w-[400px]"
          />

          {nClusters === 2 && (
            <h5 className="text-[12px] text-black/50">Cluster 0 - Human, Cluster 1 - AI</h5>
          )}
        </div>

        <ClusterStats
          allData={allData}
          accuracy={data?.pages[data.pages.length - 1]?.accuracy}
          total={data?.pages[data.pages.length - 1]?.total}
          method={method}
          nClusters={nClusters}
        />
        <ClusterChart allData={allData} method={method} nClusters={nClusters} />

        {hasNextPage && (
          <div className="mt-4">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-600"
            >
              {isFetchingNextPage ? "Загрузка..." : "Загрузить ещё"}
            </button>
          </div>
        )}
      </div>

      <SourceLinks />
    </section>
  );
};
