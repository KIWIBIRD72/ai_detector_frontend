import { serviceApi } from "../libs/axios";
import { ClusterResponseType, ClusterType, GetClusters } from "./types";

export namespace Service {
  /**
   * GET /clusters/kmeans
   */
  export const getKmeansClusters: GetClusters = async (page, pageSize, nClusters) => {
    const response = await serviceApi.get<ClusterResponseType<ClusterType>>("/clusters/kmeans", {
      params: {
        page,
        page_size: pageSize,
        n_cluster: nClusters,
      },
    });
    return response.data;
  };

  /**
   * GET /clusters/fuzzy
   */
  export const getFuzzyClusters: GetClusters = async (page, pageSize, nClusters) => {
    const response = await serviceApi.get<ClusterResponseType<ClusterType>>("/clusters/fuzzy", {
      params: {
        page,
        page_size: pageSize,
        n_cluster: nClusters,
      },
    });
    return response.data;
  };

  /**
   * GET /clusters/cnn
   */
  export const getCnnClusters: GetClusters = async (page, pageSize, nClusters) => {
    const response = await serviceApi.get<ClusterResponseType<ClusterType>>("/clusters/cnn", {
      params: {
        page,
        page_size: pageSize,
        n_cluster: nClusters,
      },
    });
    return response.data;
  };
}
