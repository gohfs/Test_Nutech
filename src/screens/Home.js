import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Accordion,
  Box,
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  HStack,
  Image,
  Input,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  VStack,
} from "native-base";
import { API, setAuthToken } from "../config/api";
import History from "../component/history";
import { useQuery, useQueryClient } from "react-query";
import { useContext } from "react";
import { MyContext } from "../context/userContext";

import profil from "../../assets/icons/profil.png";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { View } from "react-native";
import { useEffect } from "react";
import setting from "../../assets/setting.png";
import homeIcon from "../../assets/splash.png";

export default function Home({ navigation }) {
  const client = useQueryClient();
  const { dispatch } = useContext(MyContext);
  function Logout() {
    try {
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
      setAuthToken("");
      client.clear();
      dispatch({
        type: "LOGOUT",
        payload: {},
      });
    } catch (error) {
      console.log(error);
    }
  }

  // USER
  const { data: user, refetch: update } = useQuery("User", async () => {
    const response = await API.get("/getProfile");
    return response.data.data;
  });

  // TOP UP & TRANSFER
  const [modal, setModal] = useState([false, ""]);
  const closeModal = () => {
    setModal([false, ""]);
    setAmount("");
  };
  const [amount, setAmount] = useState("");
  const { data: balance, refetch } = useQuery("Balance", async () => {
    const response = await API.get("/balance");
    return response.data.data;
  });

  const postBalance = async () => {
    try {
      let numberAmount = Number(amount.replace(/[^0-9]/g, ""));
      if (numberAmount < 10000) {
        alert("Minimal transaksi Rp10.000!");
        closeModal();
        return;
      }
      let input = { amount: numberAmount };
      await API.post(`/${modal[1].toLowerCase()}`, input);
      alert(`${modal[1]} sukses!`);
      closeModal();
    } catch (error) {
      alert(error.response.data.message + "!");
    }
  };

  useEffect(() => {
    refetch();
  });

  //   LOGOUT
  const [modalLogout, setModalLogout] = useState(false);

  return (
    <>
      <ScrollView>
        <Box
          style={{
            position: "absolute",
            top: 40,
            left: 150,
          }}
        >
          <Image
            source={homeIcon}
            alt="LogoHome"
            style={{ width: 100, height: 60 }}
          />
        </Box>
        <Box
          style={{
            position: "absolute",
            right: 25,
            top: 50,
          }}
        >
          {/* <TouchableOpacity onPress={() => setModalLogout(true)}> */}
          <Image
            source={setting}
            alt="setting"
            style={{ width: 40, height: 40 }}
          />
          {/* </TouchableOpacity> */}
        </Box>
        <Center>
          <Flex>
            <Box
              style={{
                height: 80,
                backgroundColor: "#342080",
                border: "solid",
                borderWidth: 0.5,
                borderTopEndRadius: 20,
                borderTopStartRadius: 20,
                marginTop: 100,
                width: 370,
              }}
            >
              <HStack style={{ paddingTop: 14, paddingStart: 20 }}>
                <Image source={profil} alt="profile" />
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "300",
                    paddingStart: 10,
                    paddingTop: 19,
                  }}
                >
                  Hi, {user?.first_name}
                </Text>
              </HStack>
            </Box>
            <Box
              style={{
                width: 370,
                minHeight: 150,
                backgroundColor: "white",
                border: "solid",
                borderWidth: 0.5,
                borderBottomEndRadius: 20,
                borderBottomStartRadius: 20,
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontSize: 20,
                  fontWeight: "500",
                  paddingStart: 20,
                  paddingTop: 15,
                }}
              >
                Saldo
              </Text>
              <Text
                style={{
                  color: "#342090",
                  fontSize: 20,
                  fontWeight: "400",
                  paddingStart: 20,
                  paddingTop: 10,
                }}
              >
                Rp.
                {balance?.balance === null
                  ? "0"
                  : balance?.balance
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
              </Text>
              <HStack space={2} justifyContent="center" paddingTop={5}>
                <Button
                  style={{ backgroundColor: "#342080" }}
                  onPress={() => setModal([true, "Topup"])}
                >
                  Topup
                </Button>
                <Button
                  style={{ backgroundColor: "#342080" }}
                  onPress={() => setModal([true, "Transfer"])}
                >
                  Transfer
                </Button>
              </HStack>
            </Box>
          </Flex>
        </Center>
        <History />
      </ScrollView>

      {/* -------------------------- */}
      {/*MODAL TOPUP & TRANSFER  */}
      <Modal isOpen={modal[0]} onClose={() => closeModal()} avoidKeyboard>
        <Modal.Content maxWidth="400px">
          <Modal.Header style={{ backgroundColor: "#342080" }}>
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
              {modal[1]}
            </Text>
          </Modal.Header>
          <Center>
            <Modal.Body>
              <FormControl>
                <FormControl.Label>Choose Amount</FormControl.Label>
              </FormControl>
              <Button.Group>
                <VStack space={1}>
                  <Button
                    w={200}
                    onPress={() => {
                      setAmount("10.000");
                    }}
                  >
                    10.000
                  </Button>
                  <Button
                    onPress={() => {
                      setAmount("25.000");
                    }}
                  >
                    25.000
                  </Button>
                  <Button
                    onPress={() => {
                      setAmount("50.000");
                    }}
                  >
                    50.000
                  </Button>
                  <Button
                    onPress={() => {
                      setAmount("100.000");
                    }}
                  >
                    100.000
                  </Button>
                  <Button
                    onPress={() => {
                      setAmount("500.000");
                    }}
                  >
                    500.000
                  </Button>
                </VStack>
              </Button.Group>
            </Modal.Body>
          </Center>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                onPress={() => {
                  closeModal();
                }}
              >
                Cancel
              </Button>
              <Button
                style={{ backgroundColor: "#342080" }}
                onPress={() => {
                  postBalance();
                }}
              >
                {modal[1]}
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* MODAL LOGOUT */}
      {/* <Modal animationType="slide" transparent={false} visible={modalLogout}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Button onPress={() => setModalVisible(false)}>
            <Text>Close</Text>
          </Button>
        </View>
      </Modal> */}
    </>
  );
}
