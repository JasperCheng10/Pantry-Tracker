"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  Modal,
  TextField,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material/";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { firestore } from "../firebase";
import {
  collection,
  query,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [itemName, setItemName] = useState("");

  // Get Pantry from DB
  const getPantry = async () => {
    const snapshot = query(collection(firestore, "pantry"));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() });
    });
    setPantry(pantryList);
  };

  // Add Item to Pantry DB
  const addItem = async (item) => {
    // Set all items to lower case so pantry tracker is not case sensitive
    item = item.toLowerCase();
    const docRef = doc(collection(firestore, "pantry"), item);
    // Checks if item exist
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
      await getPantry();
      return;
    }
    await setDoc(docRef, { count: 1 });
    getPantry();
  };

  // Delete All Items
  const deletetAllItems = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    deleteDoc(docRef).then(() => {
      getPantry();
    });
  };

  // Change Quantity
  const changeQty = async (item, op) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);
    const { count } = docSnap.data();

    if (op == "-" && count == 1) {
      deletetAllItems(item);
    } else if (op == "+") {
      await setDoc(docRef, { count: count + 1 });
    } else {
      await setDoc(docRef, { count: count - 1 });
    }
    getPantry();
  };

  useEffect(() => {
    getPantry();
  }, []);

  // Used for Opening and Closing Modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Screen Sizing
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("xs"));
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  // QuantityText
  let quantityText;
  if (isXs || isSm) {
    quantityText = "Qty: ";
  } else {
    quantityText = "Quantity: ";
  }

  return (
    // Background Image
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('/static/images/blurry-kitchen-background.avif')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // color: "#F5EDED",
        // bgcolor: "#BD8E42",
        // border: "4px solid #333",
        // borderRadius: "4px",
      }}
    >
      {/* Entire Form */}
      <Box
        sx={{
          height: "auto",
          // width: "36vw",
          width: {
            xs: "80vw",
            sm: "75vw",
            md: "75vw",
            lg: "36vw",
            xl: "36vw",
          },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          // WIlL CHANGE THE BACKGROUND AND BORDER AROUND ENTIRE THING
          color: "#F5EDED",
          // bgcolor: "#BD8E42",
          border: "4px solid #333",
          borderRadius: "4px",
        }}
      >
        {/* Header and Add Item Button Container*/}
        <Box
          sx={{
            width: "100%",
            height: "72px",
            display: "flex",
            flexDirection: "row",
            textAlign: "left",
            p: "12px",
            color: "#F5EDED",
            bgcolor: "#BD8E42",
          }}
        >
          {/* Header Title */}
          <Typography variant="h4">Pantry</Typography>

          {/* Add Button Container */}
          <Box
            sx={{
              marginLeft: "auto",
            }}
          >
            {/* + Add Item Button */}
            <Button
              variant="outlined"
              sx={{
                variant: "outlined",
                color: "#FFFFFF",
                boxShadow:
                  "0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);",
              }}
              onClick={handleOpen}
            >
              + Add Item
            </Button>

            {/* Popup(Modal) */}
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              sx={{}}
            >
              {/* Modal Container */}
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  bgcolor: "#F5EDED",
                  border: "2px solid #000",
                  boxShadow: 24,
                  p: 4,
                  display: "flex",
                  flexDirection: "column",
                  width: {
                    xs: "75vw",
                    sm: "50vw",
                    md: "50vw",
                    lg: "50vw",
                    xl: "50vw",
                  },
                }}
              >
                {/* Header, TextField and Button Container */}
                <Box>
                  {/* Header */}
                  <Typography variant="h5" sx={{ marginBottom: "5px" }}>
                    Add Item
                  </Typography>
                </Box>
                {/* TextField */}
                <TextField
                  sx={{
                    width: "100%",
                    marginBottom: "16px",
                  }}
                  required
                  id="outlined-required"
                  label="Item"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                ></TextField>
                {/* Add Item Button */}
                <Button
                  variant="contained"
                  onClick={() => {
                    addItem(itemName);
                    handleClose();
                  }}
                >
                  Add Item
                </Button>
              </Box>
            </Modal>
          </Box>
        </Box>

        {/* Item List Container*/}
        <Stack
          sx={{
            width: "99.9%",
            height: "auto",
            maxHeight: "70vh",
            overflow: "auto",
            alignItems: "center",
            backgroundImage: "url(/'static/images/wood-texture-background.webp')",
            "& > :first-of-type": {
              mt: 2,
            },
          }}
          spacing={2}
        >
          {pantry.map(({ name, count }) => (
            // Item Container
            <Box
              key={name}
              sx={{
                width: "98%",
                height: "75px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "0.1rem solid rgba(0, 0, 0, 0.5)",
                borderRadius: "4px",
                bgcolor: "rgba(255, 255, 255, 0.25)",
              }}
            >
              {/* Item Name */}
              <Typography
                variant={"h6"}
                sx={{
                  fontSize: {
                    xs: "1.25rem", // 1.5rem on extra-small screens
                    sm: "1.25rem", // 2rem on small screens
                    md: "1.5rem", // 2.5rem on medium screens
                    lg: "1.5rem", // 3rem on large screens
                    xl: "1.5rem",
                  },
                  color: "black",
                  justifyContent: "left",
                  ml: "8px",
                }}
              >
                {/* Capitalize the first letter of i */}
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>

              {/* Quantity, Plus, Minus and Delete Container */}
              <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                {/* Minus Count Button */}
                <IconButton
                  size="large"
                  color="error"
                  onClick={() => changeQty(name, "-")}
                >
                  <RemoveIcon></RemoveIcon>
                </IconButton>

                {/* Quantity */}
                <Box
                  sx={{
                    width: "auto",
                    p: "4px",
                    border: "black 0.1rem solid",
                    borderRadius: "8px",
                  }}
                >
                  <Typography sx={{ color: "black" }}>
                    {quantityText} {count}
                  </Typography>
                </Box>

                {/* Add Count Button */}
                <IconButton
                  size="small"
                  color="success"
                  onClick={() => changeQty(name, "+")}
                >
                  <AddIcon></AddIcon>
                </IconButton>

                {/* Delete Item Button */}
                <IconButton
                  size="large"
                  color="error"
                  onClick={() => deletetAllItems(name)}
                >
                  <DeleteIcon fontSize="inherit"></DeleteIcon>
                </IconButton>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
