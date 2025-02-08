import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "../store/slices/authSlice"; // Adjust the import path
import { useCallback } from "react";

const useLogout = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const performLogout = useCallback(() => {
    dispatch(logout());
    router.push("/");
    // window.location.reload();
    // console.log("Logged out");
  }, [dispatch, router]);

  return performLogout;
};

export default useLogout;