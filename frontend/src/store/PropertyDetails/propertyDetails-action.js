import { propertyDetailsAction } from "./propertyDetails-slice";
import { axiosInstance } from "../../utils/axios";

export const getPropertyDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch(propertyDetailsAction.getListRequest());
    const response = await axiosInstance(`/api/v1/rent/listing/${id}`);
    console.log(response);
    if (!response) {
      throw new Error("Could not fetch any propertyDetails");
    }
    const { data } = response.data;
    dispatch(propertyDetailsAction.getPropertyDetails(data));
  } catch (error) {
    dispatch(propertyDetailsAction.getErrors(error.response.data.error));
  }
};
