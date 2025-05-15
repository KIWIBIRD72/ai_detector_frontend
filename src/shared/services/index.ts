import { serviceApi } from "../libs/axios";
import { ClusteringMethod, ClusterResponseType, ClusterType, GetAccuracyResponse } from "./types";

export namespace Service {
  export const getClusters = async (page = 1, pageSize = 100, method: ClusteringMethod) => {
    const response = await serviceApi.get<ClusterResponseType<ClusterType>>("/clusters", {
      params: { page, page_size: pageSize, method },
    });
    return response.data;
  };

  export const getClusterStats = async (method: ClusteringMethod) => {
    const response = await serviceApi.get<GetAccuracyResponse>("/clusters/stats", {
      params: { method },
    });
    return response.data;
  };
}
