import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(screens)',
};

export default function BusTracking() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const backgroundColor = isDark ? '#000' : '#fff';
    const textColor = isDark ? '#fff' : '#000';
    const router = useRouter();

    var protobuf = require("protobufjs");

    protobuf.load("../../assets/misc/gtfs-realtime.proto", function(err, root){
      
    })

  return (
    <View style={{backgroundColor: backgroundColor, flex: 1, alignContent:'center'}}>
        <Text style={{color: textColor, textAlign: 'center'}}>hi im marty!</Text>
    </View>
  );
}
