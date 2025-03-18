import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { UserIdContext } from "../context/MyProvider";

const ProtectedRoute = ({ children }) => {
  const { role } = useContext(UserIdContext);
  const router = useRouter();

  useEffect(() => {
    // to make the new issue
    if (role !== "ADMIN") {
      router.push("/");
    }
  }, [role, router]);


  return role === "ADMIN" ? children : null;
};

export default ProtectedRoute;
