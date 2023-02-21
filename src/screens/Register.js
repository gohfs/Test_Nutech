import { Link } from "@react-navigation/native";
import {
  Button,
  Center,
  FormControl,
  Image,
  Input,
  Square,
  Stack,
} from "native-base";
import { useContext, useState } from "react";
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";
import { useMutation } from "react-query";
import { color } from "styled-system";
import { API } from "../config/api";
import { MyContext } from "../context/userContext";

export default function Register({ navigation }) {
  const { styles } = useContext(MyContext);
  const validEmail = /^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$/;
  const validPassword = /^(?=.*?[A-Za-z])(?=.*?[0-9]).{8,}$/;
  const [invalid, setInvalid] = useState({
    email: false,
    password: false,
  });

  const [data, setData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const posting = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  const RegSubmitted = useMutation(async (e) => {
    try {
      if (validEmail.test(data.email) && validPassword.test(data.password)) {
        setInvalid({
          email: false,
          password: false,
        });
        const response = await API.post("/registration", data);
        if (response.data.status === 0) {
          alert(response.data.message);
          navigation.navigate("Login");
        }
      } else {
        if (!validEmail.test(login.email)) {
          setInvalid({ email: true });
        }
        if (!validPassword.test(login.password)) {
          setInvalid({ password: true });
        }
        if (
          !validEmail.test(login.email) &&
          !validPassword.test(login.password)
        ) {
          setInvalid({ email: true, password: true });
        }
      }
    } catch (error) {
      if (error.response.data.status === 102) {
        alert(error.response.data.message + "!");
      }
    }
  });

  return (
    <ScrollView style={{ backgroundColor: "#342080" }}>
      <KeyboardAvoidingView behavior="position">
        <Center>
          <Image
            source={require("../../assets/splash.png")}
            alt="loading"
            style={styles.entranceImage}
          />
        </Center>
        <Text
          style={{
            color: "white",
            fontWeight: "400",
            fontSize: 30,
            marginLeft: 30,
          }}
        >
          Register
        </Text>
        <FormControl>
          <Square>
            <Stack space={5} w="85%" mt={30}>
              <Stack>
                <Input
                  type={"text"}
                  value={data.email}
                  onChangeText={(value) => posting("email", value)}
                  form
                  size="lg"
                  variant="outline"
                  style={{ backgroundColor: "white" }}
                  p={2}
                  placeholder="Email"
                />
                {invalid.email && (
                  <Text style={{ color: "red" }}>
                    Surel tidak berlaku. Harap periksa kembali.
                  </Text>
                )}
              </Stack>
              <Stack>
                <Input
                  type={"password"}
                  value={data.password}
                  onChangeText={(value) => posting("password", value)}
                  size="lg"
                  variant="outline"
                  style={{ backgroundColor: "white" }}
                  p={2}
                  placeholder="Password"
                />
                {invalid.password && (
                  <Text style={{ color: "red" }}>
                    Minimal 8 karakter dengan angka dan huruf.
                  </Text>
                )}
              </Stack>
              <Stack>
                <Input
                  type={"text"}
                  value={data.first_name}
                  onChangeText={(value) => posting("first_name", value)}
                  size="lg"
                  variant="outline"
                  style={{ backgroundColor: "white" }}
                  p={2}
                  placeholder="First Name"
                />
              </Stack>
              <Stack>
                <Input
                  type={"text"}
                  value={data.last_name}
                  onChangeText={(value) => posting("last_name", value)}
                  size="lg"
                  variant="outline"
                  style={{ backgroundColor: "white" }}
                  p={2}
                  placeholder="Last Name"
                />
              </Stack>
            </Stack>
            {/* <Button style={{ width: 330, marginTop: 40 }} onPress={() => RegSubmitted.mutate()} size="lg" backgroundColor="error.600">Register</Button> */}
            <Button
              style={{ width: 330, marginTop: 40 }}
              onPress={() => RegSubmitted.mutate()}
              size="lg"
              backgroundColor="error.600"
            >
              <Text style={{ fontSize: 18, fontWeight: "400", color: "white" }}>
                Register
              </Text>
            </Button>
            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <Text style={{ fontSize: 15, fontWeight: "400", color: "white" }}>
                Already Have an Account?{" "}
              </Text>
              <Link to={{ screen: "Login" }}>
                <Text
                  style={{ color: "#f74f14", fontWeight: "500", fontSize: 15 }}
                >
                  Login Here!
                </Text>
              </Link>
            </View>
          </Square>
        </FormControl>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
