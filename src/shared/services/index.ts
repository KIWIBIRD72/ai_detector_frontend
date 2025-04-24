import { serviceApi } from "../libst/axios";
import { ClusterResponseType, ClusterType, GetAccuracyResponse } from "./types";

export namespace Service {
  export const getClusters = async (page = 1, pageSize = 100) => {
    const response = await serviceApi.get<ClusterResponseType<ClusterType>>("/clusters", {
      params: { page, pageSize },
    });
    return response.data;
  };

  export const getClusterStats = async () => {
    const response = await serviceApi.get<GetAccuracyResponse>("/clusters/stats");
    return response.data;
  };
}
