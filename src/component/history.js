import { Ionicons } from "@expo/vector-icons";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import {
  Box,
  Button,
  Center,
  HStack,
  Modal,
  ScrollView,
  View,
} from "native-base";
import { useContext } from "react";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { useQuery } from "react-query";
import { API } from "../config/api";
import { MyContext } from "../context/userContext";

export default function History() {
  const { styles } = useContext(MyContext);
  const { data, refetch } = useQuery("History", async () => {
    try {
      const response = await API.get("/transactionHistory");
      return response.data.data;
    } catch (error) {
      if (error.response.data.status === 404) {
        return [];
      }
    }
  });

  useEffect(() => {
    refetch();
  });

  const [openFilter, setOpen] = useState(false);

  /* Filter Tipe Transaksi */
  const [type, setType] = useState("Semua"); // Filter Topup/Transfer
  const typeFilter = (data) => {
    if (type === "Semua") {
      return data;
    }
    return data.filter((set) => set.transaction_type === type.toLowerCase());
  };

  /* Filter Range Transaksi */
  // Menemukan nilai kwartil sebagai nilai tumpu range
  function quartiles(arr) {
    if (arr === undefined) {
      return 0;
    }
    arr.sort((a, b) => a - b);
    let n = arr.length;
    let Q1 = arr[Math.floor(n / 4)];
    let Q2 = arr[Math.floor(n / 2)];
    let Q3 = arr[Math.floor((3 * n) / 4)];
    if (Q1 === Q2) {
      return [Q1, 0, Q3];
    }
    return [Q1, Q2, Q3];
  }

  const amountArray = data?.map((data) => data.amount); // Mendapatkan array seluruh nilai transaksi
  const range1 = `≤ ${quartiles(amountArray)[0]}`; // Opsi 1 Range Trans Amount
  let range2 = `${quartiles(amountArray)[0]} - ${quartiles(amountArray)[1]}`; // Opsi 2 Range Trans Amount
  if (quartiles(amountArray)[1] === 0) {
    range2 = 0;
  }
  const range3 = `≥ ${quartiles(amountArray)[2]}`; // Opsi 3 Range Trans Amount

  // Handle range
  const [range, setRange] = useState("Rentang"); // Filter Range Nilai Transaksi
  const rangeFilter = (array) => {
    switch (range) {
      case range1:
        return array.filter((data) => data.amount <= quartiles(amountArray)[0]);
      case range2:
        return array.filter(
          (data) =>
            data.amount >= quartiles(amountArray)[0] &&
            data <= quartiles(amountArray)[1]
        );
      case range3:
        return array.filter((data) => data.amount >= quartiles(amountArray)[2]);
      case "Rentang":
        return array;
      default:
        return array;
    }
  };

  /* Filter Waktu Transaksi */
  const [activedate, setDate] = useState(null); // Filter Transaksi pada Tanggal Spesifik
  const dateFilter = (data) => {
    if (activedate === null) {
      return data;
    }
    return data.filter((data) => data.transaction_time.includes(activedate));
  };

  let filteredData = dateFilter(rangeFilter(typeFilter(data)));

  const [mode, setMode] = useState("timeDESC");
  const changeMode = (name) => {
    setMode(name);
    if (mode === name) {
      setMode(name + "DESC");
    }
  };

  const bytime = (input) =>
    input?.sort((a, b) => {
      if (a.transaction_time < b.transaction_time) {
        return -1;
      }
      if (a.transaction_time > b.transaction_time) {
        return 1;
      }

      return 0;
    });

  const byamount = (input) => input?.sort((a, b) => a.amount - b.amount);

  let sorteddata;
  switch (mode) {
    case "time":
      sorteddata = bytime(filteredData);
      break;
    case "timeDESC":
      sorteddata = bytime(filteredData)?.reverse();
      break;
    case "amount":
      sorteddata = byamount(filteredData);
      break;
    case "amountDESC":
      sorteddata = byamount(filteredData)?.reverse();
      break;
    default:
      sorteddata = bytime(filteredData)?.reverse();
  }

  const date = new Date(Date.now());

  const onChange = (_, selectedDate) => {
    const currentDate = selectedDate;
    const monthNumber = Number(currentDate.getMonth()) + 1;
    const twoDigits = (date) => (date < 10 ? "0" + date : date);
    setDate(
      currentDate.getFullYear() +
        "-" +
        twoDigits(monthNumber) +
        "-" +
        twoDigits(currentDate.getDate())
    );
  };

  const openTime = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: date,
      is24Hour: true,
    });
  };

  const resetTime = () => {
    setDate(null);
  };

  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <>
      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
        <View
          style={{
            backgroundColor: "#342080",
            padding: 20,
            width: 370,
            border: "solid",
            borderWidth: 0.5,
            borderRadius: 20,
            marginTop: 25,
            marginStart: 10,
          }}
        >
          <Box>
            <Text style={{ color: "white", fontSize: 20, fontWeight: "400" }}>
              Transaction History
            </Text>
          </Box>
          {isExpanded && (
            <ScrollView
              style={{
                width: 370,
                minHeight: 70,
                marginTop: 10,
              }}
            >
              {sorteddata?.length === 0 ? (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 200,
                  }}
                >
                  <Text>Tidak ada transaksi yang sesuai filter.</Text>
                </View>
              ) : (
                <Box>
                  {sorteddata?.map((item) => (
                    <View
                      mb={3}
                      key={item.transaction_id}
                      style={{
                        width: "90%",
                        height: 80,
                        backgroundColor:
                          item.transaction_type === "topup"
                            ? "#e1e1e1"
                            : "#FF9899",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        borderRadius: 10,
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            color: "#342090",
                            fontSize: 20,
                            position: "absolute",
                            top: 10,
                            left: 20,
                          }}
                        >
                          Rp.
                          {item.amount
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                        </Text>
                        <Text
                          style={{
                            fontSize: 15,
                            position: "absolute",
                            bottom: 10,
                            left: 20,
                            color: "black",
                          }}
                        >
                          Date {item.transaction_time}
                        </Text>
                      </View>
                    </View>
                  ))}
                </Box>
              )}
            </ScrollView>
          )}
        </View>
      </TouchableOpacity>

      {/* MODAL TRANSACTION */}
      <Modal isOpen={openFilter} onClose={() => setOpen(false)} size={"xl"}>
        <Modal.Content>
          <Modal.Header>Saring Riwayat</Modal.Header>
          <Modal.Body style={{ backgroundColor: "#FFEFD5" }}>
            <Center>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 5,
                }}
              >
                <SelectDropdown
                  buttonStyle={styles.aThirdButton}
                  buttonTextStyle={{ fontSize: 14, color: "white" }}
                  onSelect={(value) => setType(value)}
                  data={["Semua", "Topup", "Transfer"]}
                  defaultValue={type}
                  renderDropdownIcon={() => (
                    <Ionicons
                      name={"caret-down-outline"}
                      size={15}
                      color="white"
                    />
                  )}
                  dropdownIconPosition={"right"}
                />
                <SelectDropdown
                  buttonStyle={styles.aThirdButton}
                  buttonTextStyle={{ fontSize: 14, color: "white" }}
                  onSelect={(value) => setRange(value)}
                  data={
                    isNaN(range2)
                      ? ["Rentang", range1, range2, range3]
                      : ["Rentang", range1, range3]
                  }
                  defaultValue={range}
                  renderDropdownIcon={() => (
                    <Ionicons
                      name={"caret-down-outline"}
                      size={15}
                      color="white"
                    />
                  )}
                  dropdownIconPosition={"right"}
                />
                {activedate !== null ? (
                  <Button onPress={resetTime} style={styles.aThirdButton}>
                    <Text style={{ fontSize: 14, color: "white" }}>
                      {activedate}
                    </Text>
                  </Button>
                ) : (
                  <Button onPress={openTime} style={styles.aThirdButton}>
                    <HStack>
                      <Ionicons
                        name="calendar-outline"
                        size={18}
                        color="white"
                      />
                      <Text
                        style={{
                          textAlign: "left",
                          fontSize: 14,
                          color: "white",
                        }}
                      >
                        {" "}
                        Tanggal
                      </Text>
                    </HStack>
                  </Button>
                )}
              </View>

              <View style={{ flexDirection: "row" }}>
                <Button
                  onPress={() => changeMode("time")}
                  style={{
                    ...styles.halfButton,
                    backgroundColor: mode.includes("time")
                      ? "#FFFFFF"
                      : "#f0b64a",
                  }}
                  endIcon={
                    <Ionicons
                      name={
                        mode === "time"
                          ? "arrow-up-outline"
                          : "arrow-down-outline"
                      }
                      size={15}
                      color="#ef4824"
                    />
                  }
                >
                  <Text
                    style={{
                      color: mode.includes("time") ? "#ef4824" : "#FFFFFF",
                    }}
                  >
                    Waktu
                  </Text>
                </Button>
                <Button
                  onPress={() => changeMode("amount")}
                  style={{
                    ...styles.halfButton,
                    backgroundColor: mode.includes("amount")
                      ? "#FFFFFF"
                      : "#f0b64a",
                  }}
                  endIcon={
                    <Ionicons
                      name={
                        mode === "amount"
                          ? "arrow-up-outline"
                          : "arrow-down-outline"
                      }
                      size={15}
                      color="#ef4824"
                    />
                  }
                >
                  <Text
                    style={{
                      color: mode.includes("amount") ? "#ef4824" : "#FFFFFF",
                    }}
                  >
                    Nilai
                  </Text>
                </Button>
              </View>
            </Center>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  );
}
