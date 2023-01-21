import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Compose from '../context/Compose';
import Trips from '../screens/Trips';
import TripTabNav from './TripTabNav';

import { EventProvider } from "../context/EventContext";
import { ExpProvider } from "../context/ExpContext";
import { InviteProvider } from "../context/InviteContext";
import { TripProvider } from '../context/TripContext';

// import getHeaderTitle from '../utils/getHeaderTitle';
const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    // <InfoProvider>
      // <AllProvider>
    <Compose components={[TripProvider, EventProvider, InviteProvider, ExpProvider]}>
      <Stack.Navigator>
        <Stack.Screen name='Trips' component={Trips} 
          options={({route}) => ({
            headerShown:false
          })} 
        />
        <Stack.Screen name='TripTabNav' component={TripTabNav} 
          options= {({route}) => ({
            // headerTitle: getHeaderTitle(route)
            headerTitle: route.params.params.name
          })}
        />
      </Stack.Navigator>
    </Compose>
      // </AllProvider>
    // </InfoProvider>
  )
};
