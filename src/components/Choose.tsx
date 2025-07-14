import { Button, Card, Image } from "@chakra-ui/react";
import { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Web3Context } from "../Web3ContextProvider";
import { useNavigate } from "react-router-dom";
import logoBlack from "../assets/Student Data Management(black).svg";
import logoWhite from "../assets/Student Data Management(white).svg";
import { useColorMode } from "../components/ui/color-mode";

const Choose = () => {
  const navigate = useNavigate();
  const { setTrigger, connect, check } = useContext(Web3Context);
  const theme = useColorMode().colorMode;

  const handleLogin = async () => {
    const connecdAccount = await connect();
    setTrigger((prev) => !prev);
    console.log(connecdAccount);

    if (connecdAccount) {
      console.log("Connected");
      const data = await check(connecdAccount);
      console.log("data: ", data);

      if (data.type === "moe") navigate("/admin-home");
      else if (data.type === "institute") navigate("/institution-home");
      else if (data.type === "student") navigate("/Student-home");
      else if (data.type === "rec") navigate("/rec-home");
    }
  };
  return (
    <center>
      <Card.Root width="500px" padding={2}>
        <Card.Header>
          <Image src={theme === "dark" ? logoWhite : logoBlack} />
        </Card.Header>

        <Card.Body>
          <Card.Description></Card.Description>
        </Card.Body>
        <Card.Footer justifyContent={"center"} spaceX={2}>
          <RouterLink to="/register">
            <Button variant="outline">SignUp</Button>
          </RouterLink>
          <Button onClick={handleLogin}>Login</Button>
        </Card.Footer>
      </Card.Root>
    </center>
  );
};
export default Choose;
