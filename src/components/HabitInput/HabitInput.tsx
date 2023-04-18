import { useState, Dispatch, SetStateAction } from "react";
import { Text, Input, HStack, VStack, Center, Box, useToast } from "native-base";
import { Thabits } from "../../../App";
import { Button, Chip } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface HabitInputProps {
  habits: Thabits[];
  setHabits: Dispatch<SetStateAction<Thabits[]>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const storeData = async (value: Thabits[]) => {
  const habitsStorage = JSON.stringify(value);
  try {
    await AsyncStorage.setItem("@storage_Key", habitsStorage);
  } catch (e) {
    // saving error
  }
};

export function HabitInput({
  habits,
  setHabits,
  setShowModal,
}: HabitInputProps) {
  const [habitName, setHabitName] = useState("");
  const [startDate, setStartDate] = useState<string>(new Date().toDateString());
  const [weeklyFrequency, setWeeklyFrequency] = useState<string[]>([]);
  const [inputError, setInputError] = useState(false);
  const toast = useToast()

  type DaysOfWeek =
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";

  const handleChipPress = (day: DaysOfWeek) => {
    if (weeklyFrequency.includes(day)) {
      setWeeklyFrequency(
        weeklyFrequency.filter((selectedDay) => selectedDay !== day)
      );
    } else {
      setWeeklyFrequency([...weeklyFrequency, day]);
    }
  };

  function handleNameChange(newText: string) {
    setHabitName(newText);
  }

  const handleStartDateChange = (date: string | undefined) => {
    console.log(date);
    if (date !== undefined) {
      setStartDate(date);
    }
  };

  function handleAddHabit() {
    if (habitName.length !== 0) {
      const date = new Date().toDateString();
      const newHabit: Thabits = {
        name: habitName,
        completed: 0,
        createdAt: date,
        startDate: new Date(startDate).toDateString(),
        updatedAt: "",
        weeklyFrequency,
        id: Math.random().toString(),
        hasUpdatedToday: false,
        currentStreak: 0,
        bestStreak: 0,
      };
      setHabits(() => {
        storeData([...habits, newHabit]);
        return [...habits, newHabit];
      });
      setHabitName("");
      setStartDate(new Date().toDateString());
      setWeeklyFrequency([]);
      console.log(weeklyFrequency);
      setShowModal(false);
      setInputError(false)
    } else {
      setInputError(true)
      toast.show({
        render: () => {
          return <Box bg="red.500" px="2" py="1" rounded="sm" mb={5} zIndex={999999}>
                  Please, enter a habit name!
                </Box>;
        }
      });
    }
  }
  return (
    <VStack flex={1} justifyContent={"space-between"} space={2}>
      <VStack justifyContent={"space-between"} space={4}>
        <VStack space={2}>
          <Text bold>Description</Text>
          <Input
            value={habitName}
            onChangeText={(newText) => handleNameChange(newText)}
            placeholder="Habit description"
            isInvalid={inputError}
          />
        </VStack>
        <VStack space={2}>
          <Text bold>Start Date</Text>
          <DatePickerInput
            locale="en"
            label="Start Date"
            value={new Date(startDate)}
            onChange={(d) => handleStartDateChange(d?.toDateString())}
            inputMode="start"
          />
        </VStack>
      </VStack>
      <VStack space={2}>
        <Text bold>Weekly Frequency</Text>
        <HStack space={2}>
          <Chip
            showSelectedOverlay
            selectedColor="blue"
            selected={weeklyFrequency.includes("sunday")}
            onPress={() => handleChipPress("sunday")}
          >
            Sunday
          </Chip>
          <Chip
            showSelectedOverlay
            selectedColor="blue"
            selected={weeklyFrequency.includes("monday")}
            onPress={() => handleChipPress("monday")}
          >
            Monday
          </Chip>
          <Chip
            showSelectedOverlay
            selectedColor="blue"
            selected={weeklyFrequency.includes("tuesday")}
            onPress={() => handleChipPress("tuesday")}
          >
            Tuesday
          </Chip>
        </HStack>
        <HStack space={2} justifyContent={"center"}>
          <Chip
            showSelectedOverlay
            selectedColor="blue"
            selected={weeklyFrequency.includes("wednesday")}
            onPress={() => handleChipPress("wednesday")}
          >
            Wednesday
          </Chip>
          <Chip
            showSelectedOverlay
            selectedColor="blue"
            selected={weeklyFrequency.includes("thursday")}
            onPress={() => handleChipPress("thursday")}
          >
            Thursday
          </Chip>
          <Chip
            showSelectedOverlay
            selectedColor="blue"
            selected={weeklyFrequency.includes("friday")}
            onPress={() => handleChipPress("friday")}
          >
            Friday
          </Chip>
        </HStack>
        <HStack space={2} justifyContent={"center"}>
          <Chip
            showSelectedOverlay
            selectedColor="blue"
            selected={weeklyFrequency.includes("saturday")}
            onPress={() => handleChipPress("saturday")}
          >
            Saturday
          </Chip>
        </HStack>
      </VStack>
      <Center marginTop={4}>
        <Button mode="contained" onPress={handleAddHabit}>
          + habit
        </Button>
      </Center>
    </VStack>
  );
}
