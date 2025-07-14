import { Card, VStack, Text, HStack, Button } from "@chakra-ui/react";

export interface data {
  name: string;
  address: string;
  id: string;
  index: number;
}

interface PendingProps {
  data: data[];
  accept: (name: string, address: string, id: string, index: number) => void;
  reject: (name: string, address: string, id: string, index: number) => void;
}

const PendingInst = ({ data, accept, reject }: PendingProps) => {
  return (
    <Card.Root>
      <Card.Body>
        {data.map((item, index) => (
          <VStack key={index}>
            <HStack>
              <Text>Name:</Text>
              <Text>{item.name + " " + item.id}</Text>
            </HStack>
            <HStack>
              <Text>Address:</Text>
              <Text>{item.address}</Text>
            </HStack>
            <HStack>
              <Button
                onClick={() => {
                  accept(item.name, item.address, item.id, index);
                }}
              >
                Accept
              </Button>
              <Button
                onClick={() => {
                  reject(item.name, item.address, item.id, index);
                }}
              >
                Reject
              </Button>
            </HStack>
          </VStack>
        ))}
      </Card.Body>
    </Card.Root>
  );
};

export default PendingInst;
