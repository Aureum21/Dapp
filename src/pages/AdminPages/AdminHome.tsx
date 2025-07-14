import { Grid, GridItem, HStack, Image } from "@chakra-ui/react";
import logoWhite from "../../assets/LogoWhite.svg";
import logoBlack from "../../assets/LogoBlack.svg";
import ColorMode from "../../components/ColorMode";
import { useColorMode } from "../../components/ui/color-mode";
import { useEffect, useState } from "react";
import axios from "axios";
import type { data } from "../../components/PendingInst";
import PendingInst from "../../components/PendingInst";
const AdminHome = () => {
  const colorMode = useColorMode().colorMode;
  const [pending, setPending] = useState<data[]>([]);
  useEffect(() => {
    axios.get("http://localhost:5000/listPendingInstitutes").then((res) => {
      console.log(res.data);
      setPending(res.data as data[]);
    });
  }, []);

  const accept = (name: string, address: string, id: string, index: number) => {
    axios.post("http://localhost:5000/acceptInstitute", {
      name,
      address,
      id,
      index,
    });
    // axios.get("http://localhost:5000/listPendingInstitutes").then((res) => {
    //   console.log(res.data);
    //   setPending(res.data as data[]);
    // });
  };
  const reject = (name: string, address: string, id: string, index: number) => {
    axios.post("http://localhost:5000/rejectInstitute", {
      name,
      address,
      id,
      index,
    });
    // axios.get("http://localhost:5000/listPendingInstitutes").then((res) => {
    //   console.log(res.data);
    //   setPending(res.data as data[]);
    // });
  };
  return (
    <Grid templateAreas={{ base: `"nav" "main"` }}>
      <GridItem area="nav" justifyContent={"space-between"}>
        <HStack justifyContent="space-between" padding={2}>
          <Image src={colorMode === "dark" ? logoWhite : logoBlack} />

          <ColorMode />
        </HStack>
      </GridItem>
      <GridItem area="main" padding={2}>
        <center>
          <PendingInst
            data={pending}
            accept={accept}
            reject={reject}
          ></PendingInst>
        </center>
      </GridItem>
    </Grid>
  );
};

export default AdminHome;
