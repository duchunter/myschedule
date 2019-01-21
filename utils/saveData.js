import { AsyncStorage } from 'react-native';
import { Days } from 'myschedule/config/constants';

export default async function saveData(index, data) {
  try {
    await AsyncStorage.setItem(index.toString(), JSON.stringify(data));
  } catch (error) {
    alert(`Cannot save ${Days[index]} schedule`);
  }
}
