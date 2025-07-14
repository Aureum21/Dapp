import { useContext, type MouseEvent } from "react";
import { Card, CardBody, VStack, Text, HStack, Button } from "@chakra-ui/react";
import axios from "axios";
import { Web3Context } from "../Web3ContextProvider";

export interface Data {
  name: string;
  address: string;
  email: string;
  id: string;
  index: number;
}
interface PendingProps {
  data: Data;
  type: "pending" | "transfer";
}

const Pending = ({ data, type }: PendingProps) => {
  const { account } = useContext(Web3Context);
  const handleAccept = (_e: MouseEvent<HTMLButtonElement>) => {
    axios.post("http://localhost:5000/acceptPendingStudent", {
      name: data.name,
      address: data.address,
      email: data.email,
      id: data.id,
      index: data.index,
      institute_address: account,
    });
  };

  const handleTransfer = (_e: MouseEvent<HTMLButtonElement>) => {
    axios.post("http://localhost:5000/acceptTransferStudent", {
      name: data.name,
      address: data.address,
      email: data.email,
      id: data.id,
      index: data.index,
      institute_address: account,
    });
  };

  const handleReject = (_e: MouseEvent<HTMLButtonElement>) => {
    console.log("Rejected");
  };

  return (
    <Card.Root>
      <CardBody>
        <VStack p={4}>
          <HStack>
            <Text>Name:</Text>
            <Text>{data.name}</Text>
          </HStack>
          <HStack>
            <Text>Address:</Text>
            <Text>{data.address}</Text>
          </HStack>
          <HStack>
            <Text>Email:</Text>
            <Text>{data.email}</Text>
          </HStack>
          <HStack>
            <Text>ID:</Text>
            <Text>{data.id}</Text>
          </HStack>
          <HStack>
            <Button onClick={type == "pending" ? handleAccept : handleTransfer}>
              Accept
            </Button>
            <Button onClick={handleReject}>Reject</Button>
          </HStack>
        </VStack>
      </CardBody>
    </Card.Root>
  );
};

export default Pending;
