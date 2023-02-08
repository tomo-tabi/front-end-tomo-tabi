import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Compose from '../utils/Compose';
import TripTabNav from './TripTabNav';
import TripStack from './TripsStack';

import { useContext } from 'react';
import { EventProvider } from "../context/EventContext";
import { ExpProvider } from "../context/ExpContext";
import { InviteProvider } from "../context/InviteContext";
import { TripProvider } from '../context/TripContext';
import { VoteProvider } from '../context/VoteContext';
import { AuthContext } from '../context/AuthContext';

// import getHeaderTitle from '../utils/getHeaderTitle';
const Stack = createNativeStackNavigator();

export default function AppStack() {
  const { header } = useContext(AuthContext);

  return (
    <Compose components={[TripProvider, EventProvider, InviteProvider, ExpProvider, VoteProvider]}>
      <Stack.Navigator>
        <Stack.Screen name='TripStack' component={TripStack} 
          options={({route}) => ({
            headerShown:false
          })} 
        />
        <Stack.Screen name='TripTabNav' component={TripTabNav} 
          options= {({route}) => ({
            // headerTitle: getHeaderTitle(route)
            headerTitle: route.params.params.name,
            headerShadowVisible:false,
            headerTitleAlign:'center',
            headerShown:header,
          })}
        />
      </Stack.Navigator>
    </Compose>
  )
};
