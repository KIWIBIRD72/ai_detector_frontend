import { FC, ReactNode, useMemo } from "react";
import { ClusteringMethod, ClusterType } from "../shared/services/types";

interface Props {
  allData: ClusterType[];
  accuracy?: number;
  total?: number;
  method: ClusteringMethod;
  nClusters: number;
}

const formatter = new Intl.NumberFormat("ru", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const ClusterStats: FC<Props> = ({ allData, accuracy, total, method, nClusters }) => {
  const humanLikeAmount = useMemo(
    () => allData.filter((d) => d.cluster === 0).length,
    [allData.length, method, nClusters],
  );
  const aiLikeAmount = useMemo(
    () => allData.filter((d) => d.cluster === 1).length,
    [allData.length, method, nClusters],
  );
  const incorrectAmount = useMemo(
    () => allData.filter((d) => d.cluster !== d.true_label).length,
    [allData.length, method, nClusters],
  );

  const statisticsData = useMemo(
    () => [
      {
        id: 1,
        title: "Accuracy кластеризации",
        value: nClusters === 2 ? `${accuracy ? (accuracy * 100).toFixed(2) : "..."}%` : "--",
      },
      { id: 2, title: "Общее число текстов", value: total ? formatter.format(total) : "..." },
      { id: 3, title: "Human like", value: formatter.format(humanLikeAmount) },
      { id: 4, title: "AI like", value: formatter.format(aiLikeAmount) },
      { id: 5, title: "Incorrect", value: formatter.format(incorrectAmount) },
    ],
    [allData.length, method, nClusters],
  );

  return (
    <div className="flex w-full flex-wrap gap-1">
      {statisticsData.map((stat) => (
        <StatCard key={`stat-card-${stat.id}`} title={stat.title} value={stat.value} />
      ))}
    </div>
  );
};

type StatCardProps = {
  title: string;
  value: ReactNode;
};
const StatCard: FC<StatCardProps> = (props) => {
  return (
    <div className="flex min-w-[200px] flex-col gap-1 rounded-2xl bg-white p-4 text-gray-700 shadow-md">
      {props.title} <strong className="text-[20px]">{props.value}</strong>
    </div>
  );
};
