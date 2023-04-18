import { HabitInput } from "./src/components/HabitInput/HabitInput";
import { HabitList } from "./src/components/HabitList/HabitList";
import { useState } from "react";
import { Header } from "./src/components/Header/Header";
import {
  NativeBaseProvider,
  Center,
  VStack,
  Modal,
} from "native-base";
import { Button } from "react-native-paper";

export type Thabits = {
  id: string;
  name: string;
  completed: number;
  createdAt: string;
  updatedAt: string;
  startDate: string;
  hasUpdatedToday: boolean;
  weeklyFrequency: string[];
  currentStreak: number;
  bestStreak: number;
};
export default function App() {
  const [habits, setHabits] = useState<Thabits[]>([]);
  const [showModal, setShowModal] = useState(false);
  return (
    <NativeBaseProvider>
      <VStack height={100} flex={1}>
        <Header />
        <HabitList habits={habits} setHabits={setHabits} />
        <Center mb={50}>
          <Button mode="contained" onPress={() => setShowModal(true)}>
            + Habit
          </Button>
        </Center>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Add Habit</Modal.Header>
            <Modal.Body>
              <HabitInput habits={habits} setHabits={setHabits} setShowModal={setShowModal}/>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </VStack>
    </NativeBaseProvider>
  );
}
