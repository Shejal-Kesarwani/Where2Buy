import { Stack } from "expo-router";
import WelcomeScreen from "./welcome";


export default function Layout() {
    return (
      <Stack initialRouteName="welcome" >
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
       
      </Stack>
    );
  }
