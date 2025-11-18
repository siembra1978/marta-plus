import { Ionicons } from '@expo/vector-icons';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList, DrawerToggleButton } from '@react-navigation/drawer';
//import { useNavigation } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';

//import { useColorScheme } from '@/hooks/use-color-scheme';

function CustomDrawerContent(props: DrawerContentComponentProps){
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? '#fff' : '#fff';
  const textColor = isDark ? '#fff' : '#000';

  return(
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16, paddingTop: 70, alignItems:"center"}}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign:'center', color: textColor}}>Ride285</Text>
      </View>

      <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ padding: 15, paddingTop: 0}}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: textColor}}>Live Information & Help</Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by Siembra Labs</Text>
      </View>
    </View>
      )
}

export default function DrawerLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? '#000' : '#fff';
  const textColor = isDark ? '#fff' : '#000';

  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        drawerHideStatusBarOnOpen: true,
        headerLeft: () => <DrawerToggleButton 
        imageSource={require('../../assets/images/toggle-drawer-icon.png')}
        tintColor={isDark ? '#fff' : '#000'}
        />,
        drawerActiveTintColor: isDark ? '#fff' : '#000',
        drawerInactiveTintColor: isDark ? '#bbb' : '#555',
        drawerActiveBackgroundColor: isDark ? '#222' : '#e6e6e6',
        drawerStyle: {
          backgroundColor: backgroundColor,
        },
        headerStyle: {
          backgroundColor: backgroundColor,
        },
        headerTitleStyle: {
          color: isDark ? '#fff' : '#000',
        },
      }}
      drawerContent={CustomDrawerContent}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'System Map',
          drawerLabel: 'System Map',
          drawerIcon: ({color, size}) => <Ionicons name = "map" size = {size} color = {color}></Ionicons>
        }}
      />
      <Drawer.Screen
        name="trainarrivals"
        options={{
          title: 'Train Arrivals',
          drawerLabel: 'Train Arrivals',
          drawerIcon: ({color, size}) => <Ionicons name = "subway" size = {size} color = {color}></Ionicons>
        }}
      />
      <Drawer.Screen
        name="bus"
        options={{
          title: 'Bus Tracking',
          drawerLabel: 'Bus Tracking',
          drawerIcon: ({color, size}) => <Ionicons name = "bus" size = {size} color = {color}></Ionicons>
        }}
      />
      <Drawer.Screen
        name="alerts"
        options={{
          title: 'Alerts & Delays',
          drawerLabel: 'Service Alerts',
          drawerIcon: ({color, size}) => <Ionicons name = "alert-circle" size = {size} color = {color}></Ionicons>
        }}
      />
      <Drawer.Screen
        name="marty"
        options={{
          title: 'Marty.ai',
          drawerLabel: 'Marty.ai',
          drawerIcon: ({color, size}) => <Ionicons name = "chatbox" size = {size} color = {color}></Ionicons>
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  footer: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
});
