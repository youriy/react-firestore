import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useSnackbar } from "notistack";
import AuthService from "../services/AuthService.jsx";
import Paper from "@material-ui/core/Paper";
import { Alert, AlertTitle } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
    root: {
        width: 800,
        padding: theme.spacing(1),
        margin: "auto",
        marginTop: 100,
        "& .MuiFormControl-root": {
            marginBottom: theme.spacing(1),
            marginTop: theme.spacing(1),
        },
    },
    alignButtons: {
        display: "flex",
        justifyContent: "flex-end",
    },
}));

const initValues = {
    email: "",
    password: "",
};

export default function LoginForm(props) {
    const classes = useStyles();
    const [values, setValues] = React.useState(initValues);
    const [errors, setErrors] = React.useState([]);
    const { enqueueSnackbar } = useSnackbar();
    let errorText = "Incorrect entry.";

    const showSnackbar = (message, variant) => {
        enqueueSnackbar(message, { variant: variant });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setValues({ ...values, [name]: value });
    };

    const handleFormSubmit = () => {
        let error = [];

        if (!values.email) {
            error.push("email");
        }

        if (!values.password) {
            error.push("password");
        }

        if (error.length === 0) {
            try {
                AuthService.signIn(values.email, values.password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        showSnackbar("Вы авторизированы", "success");
                        props.login();
                    })
                    .catch((error) => {
                        console.log(error.message);
                        showSnackbar("Неверный логин или пароль", "error");
                    });
            } catch (err) {
                console.log(err.message);
                showSnackbar("Ошибка авторизации", "error");
            }
        }

        setErrors(error);
    };

    return (
        <Paper className={classes.root}>
            <Grid container>
                {errors.length > 0 && (
                    <Grid item xs={12}>
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            {errors.map(function (it) {
                                return (
                                    <div key={it}>
                                        <strong>{it}</strong> — incorrect entry!
                                    </div>
                                );
                            })}
                        </Alert>
                    </Grid>
                )}
                <Grid item xs={12}>
                    <TextField
                        error={errors.indexOf("email") !== -1}
                        fullWidth
                        label="Email"
                        variant="outlined"
                        size="small"
                        name="email"
                        value={values.email}
                        onChange={handleInputChange}
                        helperText={
                            errors.indexOf("email") !== -1 ? errorText : false
                        }
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        error={errors.indexOf("password") !== -1}
                        fullWidth
                        type="password"
                        size="small"
                        label="Password"
                        variant="outlined"
                        name="password"
                        value={values.password}
                        onChange={handleInputChange}
                        helperText={
                            errors.indexOf("password") !== -1
                                ? errorText
                                : false
                        }
                    />
                </Grid>
                <Grid item xs={12}>
                    <div className={classes.alignButtons}>
                        <Button
                            variant="contained"
                            size="medium"
                            color="primary"
                            className={classes.margin}
                            onClick={() => handleFormSubmit()}
                        >
                            Войти
                        </Button>
                    </div>
                </Grid>
            </Grid>
        </Paper>
    );
}
