import { propertyAction } from "./property-slice";
import { axiosInstance } from "../../utils/axios";

export const getAllProperties = () => async (dispatch, getState) => {
  try {
    dispatch(propertyAction.getRequest());
    const { searchParams } = getState().properties;
    console.log(searchParams);
    const response = await axiosInstance.get(`/api/v1/rent/listing`, {
      params: { ...searchParams },
    });
    if (!response) {
      throw new Error("Could not fetch any properties");
    }
    const { data } = response;

    dispatch(propertyAction.getProperties(data));
  } catch (error) {
    dispatch(propertyAction.getErrors(error.message));
  }
};
