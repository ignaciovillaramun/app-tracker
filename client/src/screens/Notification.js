import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Switch,
  SafeAreaView,
  Alert,
} from 'react-native';
import FooterTabs from '../components/nav/FooterTabs';
import tw from 'twrnc';
import { db } from '../../firebaseCongif';
import { ref, set, update, get, child } from 'firebase/database';

export default function App() {
  const [vdb, setVBD] = useState(false);
  const [ht, setHT] = useState(false);
  const [rd, setRD] = useState(false);
  const [rh, setRH] = useState(false);

  useEffect(() => {
    const notificationsRef = ref(db, 'notifications/');

    get(notificationsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setVBD(data.brokenDown);
          setHT(data.traffic);
          setRD(data.deviation);
          setRH(data.reduce);
        } else {
          console.log('No data available');
        }
      })
      .catch((err) => console.log(err));
  }, []);

  function notificationsChange(value, notification) {
    try {
      update(ref(db, '/notifications'), {
        [notification]: !value,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={styles.PictureContainer}>
        <View>
          {/* <Image
            style={styles.profilePicture}
            source={require('./assets/profile.png')}
          /> */}
        </View>
      </View>
      <View style={styles.container}>
        <Text style={styles.heading}>Notifications</Text>
      </View>
      <View style={styles.OptionsContainer}>
        <View style={styles.row}>
          <Text style={styles.optionText}>Vehicle Broke Down</Text>
          <Switch
            style={styles.switch}
            onValueChange={() => {
              setVBD((prevValue) => !prevValue);
              notificationsChange(vdb, 'brokenDown');
            }}
            value={vdb}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.optionText}>Heavy Traffic</Text>
          <Switch
            style={styles.switch}
            onValueChange={() => {
              setHT((prevValue) => !prevValue);
              notificationsChange(ht, 'traffic');
            }}
            value={ht}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.optionText}>Route Deviations</Text>
          <Switch
            style={styles.switch}
            onValueChange={() => {
              setRD((prevValue) => !prevValue);
              notificationsChange(rd, 'deviation');
            }}
            value={rd}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.optionText}>Reduced Service Hours</Text>
          <Switch
            style={styles.switch}
            onValueChange={() => {
              setRH((prevValue) => !prevValue);
              notificationsChange(rh, 'reduce');
            }}
            value={rh}
          />
        </View>
      </View>
      <View style={tw`flex-1 justify-end`}>
        <FooterTabs />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    alignItems: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: '600',
  },
  PictureContainer: {
    marginTop: 70,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  profilePicture: {
    width: 40,
    height: 40,
    marginRight: 30,
  },
  OptionsContainer: {
    marginTop: 70,
    paddingHorizontal: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 50,
  },
  optionText: {
    fontSize: 18,
  },
});
