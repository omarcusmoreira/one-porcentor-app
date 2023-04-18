import { Box, Center, Container, Flex, Heading } from "native-base";
import { Text, View } from "react-native";
import {Headline, Subheading, Title} from 'react-native-paper'

export function Header() {
  const today = new Date().toDateString()
  return (
      <Center
        backgroundColor={'purple.300'}
        height={150}
        pt={50}
        borderBottomLeftRadius={36} 
        borderBottomRightRadius={36}
        shadow={2}
      >
        <Heading >OnePorcentor</Heading>
        <Subheading>{today}</Subheading>
      </Center>
  );
}
