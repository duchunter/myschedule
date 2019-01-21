import { AsyncStorage } from 'react-native';
import { Days } from 'myschedule/config/constants';

export default async function saveData(index) {
  let data;
  try {
    data = await AsyncStorage.getItem(index.toString());
  } catch (error) {
    alert(`Cannot get ${Days[index]} schedule`);
    return [];
  }

  return data ? JSON.parse(data) : [];
}
