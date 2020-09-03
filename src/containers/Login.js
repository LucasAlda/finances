import React, { useState } from "react";
import { Avatar, Button, CssBaseline, TextField, Typography, Container } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: "#2b76ca !important",
  },
}));

export default function SignIn({ setUser, history }) {
  const classes = useStyles();

  const [form, setForm] = useState({ user: "", password: "" });

  const handleChange = (e) => {
    const newForm = { ...form, [e.target.name]: e.target.value };
    setForm(newForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.user === process.env.REACT_APP_USER && form.password === process.env.REACT_APP_PASS) {
      const newUser = {
        user: process.env.REACT_APP_USER,
        password: process.env.REACT_APP_PASS,
        name: process.env.REACT_APP_NAME,
      };
      setUser(newUser);
      window.localStorage.setItem("user", JSON.stringify(newUser));
      history.push("/");
    } else {
      window.localStorage.clear();
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Iniciar Sesión
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Usuario"
            onChange={handleChange}
            name="user"
            autoComplete="user"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            onChange={handleChange}
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            Entrar
          </Button>
        </form>
      </div>
    </Container>
  );
}
