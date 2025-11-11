import { useLocation } from "react-router-dom";

export const useCheckRouter = (page) => {
  const location = useLocation();

  switch (page) {
    case "checkout":
      return /^\/checkout\/[^\/]+$/.test(location.pathname);
    default:
      return false;
  }
};
