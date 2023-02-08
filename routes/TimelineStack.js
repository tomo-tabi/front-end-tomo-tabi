import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigationState } from '@react-navigation/native';
import TimeLine from '../screens/TimeLine';
import Voting from '../screens/Voting';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

export default function TimelineStack() {
  const { setHeader } = useContext(AuthContext);
  
  const state = useNavigationState(state => state);

  useEffect(() => {
    if (state.routes[0].state) {
      if (state.routes[0].state.index === 0) {
        setHeader(true);
      }
    }
  }, [state.routes[0]])

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