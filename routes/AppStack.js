import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { InfoProvider } from '../context/InfoContext';

import Trips from '../screens/Trips';
import TripTabNav from './TripTabNav';

// import getHeaderTitle from '../utils/getHeaderTitle';
const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <InfoProvider>
      <Stack.Navigator>
        <Stack.Screen name='Trips' component={Trips} />
        <Stack.Screen name='TripTabNav' component={TripTabNav} 
          options= {({route}) => ({
            // headerTitle: getHeaderTitle(route)
            headerTitle: route.params.params.name
          })}
        />
      </Stack.Navigator>
    </InfoProvider>
  )
};
