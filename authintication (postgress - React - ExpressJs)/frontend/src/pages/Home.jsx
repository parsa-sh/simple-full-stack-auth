import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar,
  Link,
  Avatar,
} from "@mui/material";
import { userStore } from "../utils/contex";

function Home() {
  const user = userStore((state) => state.user);
  const logout = userStore((state) => state.logout);
  return (
    <Box
      width={"100vw"}
      height={"100vh"}
      display={"flex"}
      flexDirection={"row"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Stack
        width={"30%"}
        height={"60%"}
        boxSizing={"border-box"}
        paddingX={"34px"}
        paddingTop={"24px"}
        bgcolor={"#d9d9d95e"}
        borderRadius={"12px"}
        boxShadow={"0px 0px 14px 3px #878787"}
        justifyContent={"start"}
        alignItems={"center"}
        gap={"34px"}
      >
        <Avatar sx={{ width: "120px", height: "120px" }} />
        <TextField
          fullWidth
          id="name"
          label="Name"
          defaultValue={user.username}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />
        <TextField
          fullWidth
          id="email"
          label="Email"
          defaultValue={user.email}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />
        <Button variant="contained" fullWidth onClick={logout}>Logout</Button>
      </Stack>
    </Box>
  );
}

export default Home;
