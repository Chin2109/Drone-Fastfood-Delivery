import { api } from "../../../config/api";
import {
  createOrderFailure,
  createOrderRequest,
  createOrderSuccess,
  getUsersOrdersFailure,
  getUsersOrdersRequest,
  getUsersOrdersSuccess,
} from "./ActionCreators";
import {
  CHECKOUT_PREVIEW_FAILURE,
  CHECKOUT_PREVIEW_REQUEST,
  CHECKOUT_PREVIEW_SUCCESS,
  GET_USERS_NOTIFICATION_FAILURE,
  GET_USERS_NOTIFICATION_SUCCESS,
} from "./ActionTypes";

export const createOrder = (reqData) => {
  return async (dispatch) => {
    dispatch(createOrderRequest());
    try {
      const { data } = await api.post("/order/create", reqData.order, {
        headers: {
          Authorization: `Bearer ${reqData.jwt}`,
        },
      });
      if (data.data.paymentUrl) {
        window.location.href = data.data.paymentUrl;
      }
      console.log("created order data", data);
      dispatch(createOrderSuccess(data));
    } catch (error) {
      console.log("error ", error);
      dispatch(createOrderFailure(error));
    }
  };
};

export const checkoutPreview = (reqData) => {
  return async (dispatch) => {
    dispatch({ type: CHECKOUT_PREVIEW_REQUEST });
    try {
      const { data } = await api.post(
        `/cart-preview/checkout-calculate/${reqData.merchantId}`,
        reqData.order,
        {
          headers: {
            Authorization: `Bearer ${reqData.jwt}`,
          },
        }
      );

      console.log(data.data)

      dispatch({ type: CHECKOUT_PREVIEW_SUCCESS, payload: data });
    } catch (error) {
      console.log("error ", error);
      dispatch({ type: CHECKOUT_PREVIEW_FAILURE, payload: error.message });
    }
  };
};

export const getUsersOrders = (jwt) => {
  return async (dispatch) => {
    dispatch(getUsersOrdersRequest());
    try {
      const { data } = await api.get(`/api/order/user`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("users order ", data);
      dispatch(getUsersOrdersSuccess(data));
    } catch (error) {
      dispatch(getUsersOrdersFailure(error));
    }
  };
};


export const getUsersNotificationAction = () => {
  return async (dispatch) => {
    dispatch(createOrderRequest());
    try {
      const { data } = await api.get("/api/notifications");

      console.log("all notifications ", data);
      dispatch({ type: GET_USERS_NOTIFICATION_SUCCESS, payload: data });
    } catch (error) {
      console.log("error ", error);
      dispatch({ type: GET_USERS_NOTIFICATION_FAILURE, payload: error });
    }
  };
};
