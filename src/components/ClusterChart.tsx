import { FC, useMemo } from "react";
import { ClusteringMethod, ClusterType } from "../shared/services/types";
import { ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, Scatter, Legend } from "recharts";
import { cn } from "../shared/utils/cn";

interface Props {
  allData: ClusterType[];
  method: ClusteringMethod;
}

export const ClusterChart: FC<Props> = ({ allData, method }) => {
  const correctData = useMemo(
    () => allData.filter((d) => d.cluster === d.true_label),
    [allData.length, method],
  );
  const incorrectData = useMemo(
    () => allData.filter((d) => d.cluster !== d.true_label),
    [allData.length, method],
  );

  const humanCorrectData = useMemo(
    () => correctData.filter((d) => d.cluster === 0),
    [correctData.length],
  );
  const aiCorrectData = useMemo(
    () => correctData.filter((d) => d.cluster === 1),
    [correctData.length],
  );

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
                    : point.cluster === 0
                      ? "border-[#8884d8]"
                      : "border-[#82ca9d]",
                )}
              >
                <div>
                  <strong>Текст:</strong> {point.text.slice(0, 200)}...
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
        data={humanCorrectData}
        fill="#8884d8"
        isAnimationActive={false}
      />
      <Scatter
        name="Cluster 1 (AI)"
        data={aiCorrectData}
        fill="#82ca9d"
        isAnimationActive={false}
      />
      <Scatter
        name="Неверно кластеризовано"
        data={incorrectData}
        fill="#ff4d4f"
        isAnimationActive={false}
      />
    </ScatterChart>
  );
};
