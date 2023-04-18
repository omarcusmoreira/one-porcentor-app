import {
  HStack,
  VStack,
  Text,
  ScrollView,
  IconButton,
  CloseIcon,
  DeleteIcon,
  Heading,
  Image,
} from "native-base";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Thabits } from "../../../App";
import { Button, ProgressBar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

function countOccurrences(habit: Thabits) {
  const today = new Date().getTime();
  const startDate = new Date(habit.startDate).getTime();
  let occurrences = 0;
  if (startDate > today) {
    console.log("não começou");
    return 0;
  }

  const daysSinceStart = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
  for (let i = 0; i < daysSinceStart; i++) {
    const currentDate = new Date(startDate + i * 24 * 60 * 60 * 1000);
    const dayOfWeek = currentDate
      .toLocaleString("en-us", { weekday: "long" })
      .toLowerCase()
      .split(",")[0]
      .trim();
    if (habit.weeklyFrequency.includes(dayOfWeek)) {
      occurrences++;
    }
  }
  console.log("ocorrencias: " + occurrences);
  return occurrences;
}

interface HabitListProps {
  habits: Thabits[];
  setHabits: Dispatch<SetStateAction<Thabits[]>>;
}
export function HabitList({ habits, setHabits }: HabitListProps) {
  function handleDeleteHabit(id: string) {
    setHabits((currentHabit) => {
      return currentHabit.filter((habit) => {
        return habit.id !== id;
      });
    });
    console.log(id);
  }
  function handleUpdateOnePorcent(id: string) {
    const newHabit = habits.map((habit) => {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      console.log("updated at: " + habit.updatedAt);
      console.log("yesterday: " + yesterday);
      console.log("XXXXXXXXXXX" + habit.updatedAt === yesterday.toDateString());
      if (habit.id === id) {
        console.log("achou id");
        if (habit.updatedAt === yesterday.toDateString()) {
          console.log("data de update é de ontem");
          if (habit.currentStreak >= habit.bestStreak) {
            console.log("current streak é maior que best");
            return {
              ...habit,
              completed: habit.completed + 1,
              hasUpdatedToday: true,
              updatedAt: new Date().toDateString(),
              currentStreak: habit.currentStreak + 1,
              bestStreak: habit.currentStreak + 1,
            };
          } else {
            console.log("current não é maior que best");
            return {
              ...habit,
              completed: habit.completed + 1,
              hasUpdatedToday: true,
              updatedAt: new Date().toDateString(),
              currentStreak: habit.currentStreak + 1,
            };
          }
        } else {
          console.log("não fez update ontem");
          return {
            ...habit,
            completed: habit.completed + 1,
            hasUpdatedToday: true,
            updatedAt: new Date().toDateString(),
            currentStreak: 1,
          };
        }
      }
      return habit;
    });
    setHabits(newHabit);
  }

  function handleResetHabit(id: string) {
    const newHabit = habits.map((habit) => {
      if (habit.id === id) {
        return { ...habit, completed: 0 };
      }
      return habit;
    });
    setHabits(newHabit);
  }

  useEffect(() => {
    const getData = async (): Promise<void> => {
      try {
        const data = await AsyncStorage.getItem('@storage_Key');
        if (data !== null) {
          setHabits(JSON.parse(data));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  return (
    <ScrollView flex={1}>
      {habits.length === 0 ? (
        <VStack
          height={"full"}
          space={6}
          justifyContent={"center"}
          alignItems={"center"}
          p={12}
        >
          <Image
            alt="Nothing here"
            height={250}
            source={require("../../../assets/nothing.png")}
          />
          <Heading alignItems={"center"}>
            Add your first Habit to track...
          </Heading>
        </VStack>
      ) : (
        <VStack flex={1} p={5} borderBottomColor={"black"}>
          {habits.map((habit) => {
            const date = new Date().toDateString();
            console.log(
              habit.name + " Today: " + date + "updatedAt: " + habit.updatedAt
            );
            const actualCompletedPercentage = habit.completed;
            const hasUpdatedToday = habit.updatedAt === date;
            return (
              <VStack
                key={habit.id}
                mb={8}
                borderRadius={16}
                borderStyle={"solid"}
                borderColor={"black.800"}
                backgroundColor={"gray.50"}
                p={4}
                shadow={2}
              >
                <HStack
                  shadow={-2}
                  backgroundColor={"white"}
                  p={2}
                  width={"full"}
                  borderRadius={16}
                  justifyContent={"space-between"}
                >
                  <VStack flex={1}>
                    <Text bold fontSize={"lg"}>
                      {habit.name}
                    </Text>
                    <Text fontSize={"md"}>
                      {habit.weeklyFrequency.length}x por semana
                    </Text>
                  </VStack>
                  <Button
                    mode="elevated"
                    disabled={hasUpdatedToday}
                    onPress={() => handleUpdateOnePorcent(habit.id)}
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    {!hasUpdatedToday ? "+1%" : "✅"}
                  </Button>
                </HStack>
                <HStack justifyContent={"space-between"}>
                  <HStack
                    flex={1}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Text>Current Streak: {habit.currentStreak}</Text>
                    <Text>Best Streak: {habit.bestStreak}</Text>
                  </HStack>
                  <HStack>
                    <IconButton
                      onPress={() => handleResetHabit(habit.id)}
                      icon={<CloseIcon color={"red"} />}
                      color={"red.200"}
                    />
                    <IconButton
                      onPress={() => handleDeleteHabit(habit.id)}
                      icon={<DeleteIcon />}
                    />
                  </HStack>
                </HStack>
                <ProgressBar
                  progress={actualCompletedPercentage / 365}
                  color={actualCompletedPercentage === countOccurrences(habit) ? "green" : "red"}
                />
                <ProgressBar
                  progress={countOccurrences(habit) / 365}
                  color="blue"
                />
              </VStack>
            );
          })}
        </VStack>
      )}
    </ScrollView>
  );
}
