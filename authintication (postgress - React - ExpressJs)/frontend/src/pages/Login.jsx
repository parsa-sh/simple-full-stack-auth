import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useNavigate, Link as RouterLink, useLocation } from "react-router";
import { userStore } from "../utils/contex";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [snackbarText, setSnackbarText] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const setLogin = userStore((state) => state.login);

  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const handleShowPass = () => setShowPass((show) => !show);

  const handleLogin = async () => {
    const data = { username: username, password: password };
    try {
      const res = await axios.post(`${baseURL}/login`, data);
      const result = res.data;
      setLogin(result.user);
      setSnackbarText("Welcome");
      navigate("/home");
    } catch (error) {
      console.error("Error fetching users:", error);
      setSnackbarText(error.response.data.error);
      setOpenSnackbar(true);
      setPassword("");
      setUsername("");
    }
  };

  const handleSnackbarCloseBtn = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (location.state?.signupSuccess) {
      setOpenSnackbar(true);
      setSnackbarText("Signup successful! Please log in.");
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  return (
    <Box
      display={"flex"}
      flexDirection={"row-reverse"}
      width={"100vw"}
      height={"100vh"}
    >
      <Stack
        width={"50%"}
        height={"100%"}
        gap={"48px"}
        justifyContent={"center"}
        boxSizing={"border-box"}
        paddingX={"120px"}
      >
        <Typography fontSize={"48px"} fontFamily={"MyFont"} fontWeight={"bold"}>
          Account Login
        </Typography>
        <Typography fontSize={"20px"} fontFamily={"MyFont"} color="#808080">
          If you are already a member , you can login using username and
          Password , if not{" "}
          <Link
            component={RouterLink}
            to="/signup"
            underline="hover"
            color="primary"
          >
            create an acoount
          </Link>
        </Typography>
        <Divider />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxSizing: "border-box",
            gap: "48px",
          }}
        >
          <TextField
            label="Username"
            fullWidth
            variant="outlined"
            required
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              "& .MuiInputBase-root": {
                fontFamily: "MyFont",
                paddingX: "12px",
              },
              "& .MuiInputLabel-root": {
                fontFamily: "MyFont",
                fontSize: "16px",
                color: "#808080",
              },
            }}
          />
          <TextField
            label="Password"
            fullWidth
            variant="outlined"
            required
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={handleShowPass}>
                    {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiInputBase-root": {
                fontFamily: "MyFont",
                paddingX: "12px",
              },
              "& .MuiInputLabel-root": {
                fontFamily: "MyFont",
                fontSize: "16px",
                color: "#808080",
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            onClick={handleLogin}
            sx={{
              fontFamily: "MyFont",
              fontWeight: "Bold",
              height: "100%",
              fontSize: "24px",
            }}
          >
            Login
          </Button>
        </form>
      </Stack>
      <Stack
        width={"50%"}
        height={"100%"}
        bgcolor={"#1565C0"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <DotLottieReact
          src="/assets/animation/login.lottie"
          loop
          autoplay
          style={{
            width: "600px",
            height: "600px",
            border: "none",
            filter: "drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.66))",
          }}
        />
      </Stack>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={openSnackbar}
        onClose={handleSnackbarCloseBtn}
        autoHideDuration={6000}
      >
        <Alert
          severity={location.pathname ? "success" : "error"}
          variant="filled"
          sx={{ width: "100%" }}
          onClose={handleSnackbarCloseBtn}
        >
          {snackbarText}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Login;
