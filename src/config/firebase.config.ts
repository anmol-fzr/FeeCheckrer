import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { envs } from "../utils";

const firebaseConfig = {
  apiKey: envs.FIREBASE.API_KEY,
  authDomain: envs.FIREBASE.AUTH_DOMAIN,
  databaseURL: envs.FIREBASE.DB_URL,
  projectId: envs.FIREBASE.PROJECT_ID,
  storageBucket: envs.FIREBASE.STORAGE_BUCKET,
  messagingSenderId: envs.FIREBASE.MESSAGING_SENDER_ID,
  appId: envs.FIREBASE.APP_ID,
  measurementId: envs.FIREBASE.MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const fbRealTimeDB = getDatabase(app);

//const updateGlobalSetting = (newSettingValue) => {
//  set(ref(database, "globalSettings/settingName"), {
//    settingValue: newSettingValue,
//    updatedAt: Date.now(),
//  });
//};

export { fbRealTimeDB };
