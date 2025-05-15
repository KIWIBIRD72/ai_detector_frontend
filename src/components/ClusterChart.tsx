import { FC, useMemo } from "react";
import { ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, Scatter, Legend } from "recharts";
import { ClusteringMethod, ClusterType, Label } from "../shared/services/types";
import { cn } from "../shared/utils/cn";

// Генератор случайного цвета
const getRandomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;

interface Props {
  allData: ClusterType[];
  method: ClusteringMethod;
  nClusters: number;
}

export const ClusterChart: FC<Props> = ({ allData, method, nClusters }) => {
  const correctData = useMemo(
    () => allData.filter((d) => (nClusters === 2 ? d.cluster === d.true_label : true)),
    [allData.length, method, nClusters],
  );

  const incorrectData = useMemo(
    () => allData.filter((d) => (nClusters === 2 ? d.cluster !== d.true_label : false)),
    [allData.length, method, nClusters],
  );

  // Получаем все кластеры, представленные в correctData
  const clusterIds = useMemo(() => {
    const ids = new Set<number>();
    correctData.forEach((d) => ids.add(d.cluster));
    return Array.from(ids).sort((a, b) => a - b);
  }, [correctData]);

  // Карта: id кластера → цвет
  const clusterColors = useMemo(() => {
    const colors = new Map<number, string>();
    clusterIds.forEach((id) => {
      if (id === Label.HUMAN) colors.set(id, "#8884d8");
      else if (id === Label.AI) colors.set(id, "#82ca9d");
      else colors.set(id, getRandomColor());
    });
    return colors;
  }, [clusterIds]);

  // Группировка данных по кластеру
  const clusterDataMap = useMemo(() => {
    const map = new Map<number, ClusterType[]>();
    correctData.forEach((point) => {
      if (!map.has(point.cluster)) map.set(point.cluster, []);
      map.get(point.cluster)!.push(point);
    });
    return map;
  }, [correctData]);

  return (
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
                  point.cluster !== point.true_label
                    ? "border-red-400"
                    : clusterColors.get(point.cluster)
                      ? ""
                      : "border-gray-400",
                )}
              >
                <div>
                  <strong>Текст:</strong> {point.text.slice(0, 200)}...
                </div>
                <div>
                  <strong>Определенный кластер:</strong> {point.cluster}
                </div>
                <div>
                  <strong>Истинный кластер:</strong> {point.true_label}
                </div>
              </div>
            );
          }
          return null;
        }}
      />
      <Legend />

      {/* Правильно определённые точки по кластерам */}
      {clusterIds.map((id) => (
        <Scatter
          key={`cluster-${id}`}
          name={`Cluster ${id}`}
          data={clusterDataMap.get(id) ?? []}
          fill={clusterColors.get(id)!}
          isAnimationActive={false}
        />
      ))}

      {/* Неверно определённые */}
      <Scatter
        name="Неверно кластеризовано"
        data={incorrectData}
        fill="#ff4d4f"
        isAnimationActive={false}
      />
    </ScatterChart>
  );
};
