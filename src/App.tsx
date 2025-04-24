import { useQuery } from "@tanstack/react-query";
import { Service } from "./shared/services";
import { ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, Scatter, Legend } from "recharts";
import { useEffect, useState } from "react";
import { ClusterType } from "./shared/services/types";
import { cn } from "./shared/utils/cn";

export const App = () => {
  const [page, setPage] = useState(1);
  const [allData, setAllData] = useState<ClusterType[]>([]);

  const { data: clusterData, isFetching } = useQuery({
    queryKey: ["clusters", page],
    queryFn: () => Service.getClusters(page),
    refetchOnMount: true,
  });

  useEffect(() => {
    if (clusterData?.data) {
      setAllData((prev) => [...prev, ...clusterData.data]);
    }
  }, [clusterData]);

  const { data: stats } = useQuery({
    queryKey: ["clusters-stats"],
    queryFn: () => Service.getClusterStats(),
    refetchOnMount: true,
  });

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const correctData = allData.filter((d) => d.cluster === d.true_label);
  const incorrectData = allData.filter((d) => d.cluster !== d.true_label);

  return (
    <section className="mx-auto max-w-[1100px]">
      <div className="p-6">
        <h2 className="mb-4 text-2xl font-semibold">Кластеризация AI & Human текстов</h2>
        <a
          className="text-blue-600 underline"
          target="_blank"
          href="https://huggingface.co/datasets/HumanLLMs/Human-Like-DPO-Dataset"
        >
          Ссылка на датасет hugging face
        </a>
        <div className="mb-4 text-gray-700">
          Accuracy кластеризации:{" "}
          {stats ? <strong>{(stats.accuracy * 100).toFixed(2)}%</strong> : "Loading..."}
        </div>

        <ScatterChart width={1000} height={600}>
          <CartesianGrid />
          <XAxis type="number" dataKey="x" name="X" />
          <YAxis type="number" dataKey="y" name="Y" />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const point = payload[0].payload as ClusterType;
                return (
                  <div
                    className={cn(
                      "max-w-md rounded-xl border bg-white p-2 shadow",
                      point.cluster === 0 ? "border-[#8884d8]" : "border-[#82ca9d]",
                    )}
                  >
                    <div>
                      <strong>Текст:</strong> {point.text.slice(0, 100)}...
                    </div>
                    <div>
                      <strong>Определенный кластер:</strong>{" "}
                      {point.cluster === 0 ? "Human (0)" : "AI (1)"}
                    </div>
                    <div>
                      <strong>Истинный кластер:</strong> {point.true_label === 0 ? "Human" : "AI"}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Scatter
            name="Cluster 0 (Human)"
            data={correctData.filter((d) => d.cluster === 0)}
            fill="#8884d8"
          />
          <Scatter
            name="Cluster 1 (AI)"
            data={correctData.filter((d) => d.cluster === 1)}
            fill="#82ca9d"
          />
          <Scatter name="Неверно кластеризовано" data={incorrectData} fill="#ff4d4f" />
        </ScatterChart>

        <div className="mt-4">
          <button
            onClick={handleLoadMore}
            disabled={isFetching}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            {isFetching ? "Загрузка..." : "Загрузить ещё"}
          </button>
        </div>
      </div>
    </section>
  );
};
