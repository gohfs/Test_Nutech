import { createContext, useReducer, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const MyContext = createContext({});

const initialState = {
  isLogin: false,
  user: {},
};

const logReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "LOGIN":
      return {
        isLogin: true,
        user: payload,
      };
    case "LOGOUT":
      return {
        isLogin: false,
        user: {},
      };
    default:
      throw new Error();
  }
};

export function MyContextProvider({ children }) {
  const [state, dispatch] = useReducer(logReducer, initialState);

  const defaultMode = useColorScheme();
  const [theme, setTheme] = useState(defaultMode);
  let darkMode = theme === "dark";

  const styles = {
    container: {
      flex: 1,
      backgroundColor: "#4DF3E9",
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      color: "#000000",
      fontSize: 15,
    },
    bgColor: {
      backgroundColor: "#4DF3E9",
    },
    bgTextInput: {
      backgroundColor: "#f5f5f5",
      color: "#fff",
    },
    halfButton: {
      width: "49.5%",
      height: 40,
      backgroundColor: "#f0b64a",
      borderRadius: 10,
      borderColor: "#ef4824",
      borderWidth: 1,
    },
    aThirdButton: {
      width: "33%",
      height: 40,
      backgroundColor: "#f0b64a",
      borderRadius: 10,
      borderColor: "#ef4824",
      borderWidth: 1,
    },
    entranceImage: {
      width: "100%",
      height: 250,
      resizeMode: "contain",
      marginTop: 40,
      marginBottom: 0,
    },
    entranceTitle: {
      fontSize: 30,
      fontWeight: "900",
      color: "#000000",
    },
    historyHead: {
      width: "100%",
      paddingTop: 15,
      backgroundColor: darkMode ? "#9a3412" : "#fb923c",
      borderTopRightRadius: 30,
      borderTopLeftRadius: 30,
    },
    historySlide: {},
  };

  const backgroundExcept = ["historySlide", "historyHead"];

  for (let key in styles) {
    if ("backgroundColor" in styles[key] && !backgroundExcept.includes(key)) {
      styles[key].backgroundColor = darkMode ? "#000000" : "#fff";
    }
    if ("color" in styles[key] && !backgroundExcept.includes(key)) {
      styles[key].color = darkMode ? "#fff" : "#000000";
    }
  }

  return (
    <MyContext.Provider
      value={{
        state: state,
        dispatch: dispatch,
        theme: theme,
        setTheme: setTheme,
        styles: styles,
      }}
    >
      {children}
    </MyContext.Provider>
  );
}
