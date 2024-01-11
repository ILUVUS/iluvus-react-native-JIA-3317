import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

// Screens imports
import LoginScreen from './screens/login/Login'
import RegistrationScreen from './screens/login/Registration'
import HomeScreen from './screens/HomeScreen'
import SetupCommunity from './screens/community/SetupCommunity'


// Constants imports
import STRINGS from './constants/strings'

import { LogBox } from 'react-native'

LogBox.ignoreAllLogs(true)

const Stack = createStackNavigator()

const initialRouteName = STRINGS.setupCommunity

export default function Screen() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={initialRouteName}>
                <Stack.Screen
                    name={STRINGS.loginscreen}
                    component={LoginScreen}
                    options={{
                        title: STRINGS.loginscreen,
                        headerShown: false,
                    }}
                />

                <Stack.Screen
                    name={STRINGS.registerscreen}
                    component={RegistrationScreen}
                    options={{
                        title: STRINGS.registerscreen,
                        headerShown: true,
                    }}
                />

                <Stack.Screen
                    name={STRINGS.homescreen}
                    component={HomeScreen}
                    options={{
                        title: STRINGS.homescreen,
                        headerShown: false,
                    }}
                />

                <Stack.Screen
                    name={STRINGS.setupCommunity}
                    component={SetupCommunity}
                    options={{
                        title: STRINGS.newCommunity,
                        headerShown: true,
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}