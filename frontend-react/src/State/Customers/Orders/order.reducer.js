import {
  CHECKOUT_PREVIEW_FAILURE,
  CHECKOUT_PREVIEW_REQUEST,
  CHECKOUT_PREVIEW_SUCCESS,
  CREATE_ORDER_FAILURE,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  GET_USERS_NOTIFICATION_SUCCESS,
  GET_USERS_ORDERS_FAILURE,
  GET_USERS_ORDERS_REQUEST,
} from "./ActionTypes";

const initialState = {
  loading: false,
  error: null,
  previews: [],
  orders: [],
  notifications: [],
};
export const orderReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case CHECKOUT_PREVIEW_REQUEST:
    case CREATE_ORDER_REQUEST:
    case GET_USERS_ORDERS_REQUEST:
      return {
        ...state,
        error: null,
        loading: true,
      };

    case CHECKOUT_PREVIEW_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        previews: payload.data,
      };

    case CREATE_ORDER_SUCCESS:
    case GET_USERS_NOTIFICATION_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        orders: payload.data,
      };

    case GET_USERS_NOTIFICATION_SUCCESS:
      return { ...state, notifications: payload, error: null, loading: false };

    case CHECKOUT_PREVIEW_FAILURE:
    case CREATE_ORDER_FAILURE:
    case GET_USERS_ORDERS_FAILURE:
      return { ...state, error: payload, loading: false };
    default:
      return state;
  }
};
