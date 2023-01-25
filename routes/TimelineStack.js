import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TimeLine from '../screens/TimeLine';
import Voting from '../screens/Voting';

const Stack = createNativeStackNavigator();

export default function TimelineStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Timeline' component={TimeLine} 
        options={({route}) => ({
          headerShown:false,
          
        })} 
      />
      <Stack.Screen name='Voting' component={Voting} />
    </Stack.Navigator>
  )
};