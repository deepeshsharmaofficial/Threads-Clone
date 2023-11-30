import { Button } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import { FiLogOut } from "react-icons/fi";

// Recoil
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";

const LogoutButton = () => {
  const showToast = useShowToast();

  // Recoil
  const setUser = useSetRecoilState(userAtom);
  
  const handleLogout = async () => {
    try {

      // fetch
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if(data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      localStorage.removeItem("user-threads");
      setUser(null);

    } catch (err) {
      showToast("Error", err, "error")
    }
  }

  return (
    <div>
      <Button position="fixed" top="30px" right="30px" size="sm" onClick={handleLogout}>
        <FiLogOut size={20} />
      </Button>
    </div>
  )
}

export default LogoutButton;