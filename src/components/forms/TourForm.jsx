import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Alert, AlertTitle } from "@material-ui/lab";
import DataService from "../../services/DataService.jsx";
import { useSnackbar } from "notistack";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import AlarmIcon from "@material-ui/icons/AddAlarm";
import { IconButton, InputAdornment } from "@material-ui/core";

const initValues = {
    date: new Date().getTime(),
    sent: false,
};

const useStyles = makeStyles((theme) => ({
    root: {
        "& .MuiFormControl-root": {
            marginBottom: theme.spacing(1),
            marginTop: theme.spacing(1),
        },
    },
    margin: {
        margin: theme.spacing(1),
    },
    alignButtons: {
        display: "flex",
        justifyContent: "flex-end",
    },
}));

export default function TourForm(props) {
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
        setValues({
            ...values,
            [name]: value,
        });
    };

    const handleDateChange = (date) => {
        setValues({ ...values, date: new Date(date).getTime() });
    };

    const handleChecboxChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.checked });
    };

    /**
     * Запрос данных при редактировании
     */
    React.useEffect(() => {
        if (props.updateId !== false) {
            console.log(props.updateId);
            DataService.getById("tour", props.updateId)
                .then((docSnap) => {
                    if (docSnap.exists()) {
                        setValues(docSnap.data());
                        console.log("Document data:", docSnap.data());
                    } else {
                        showSnackbar("Данные уже удалены", "error");
                    }
                })
                .catch((error) => {
                    console.log(error.message);
                    showSnackbar("Ошибка при получении данных", "error");
                });
        }
    }, []);

    /**
     * Валидация и отправка формы
     */
    const handleFormSubmit = () => {
        let error = [];

        if (!values.date) {
            error.push("date");
        }

        if (error.length === 0) {
            try {
                if (props.updateId === false) {
                    DataService.add("tour", {
                        date: values.date,
                        sent: values.sent,
                    }).then((res) => {
                        props.closeDialog();
                        props.update();
                        showSnackbar("Запись сохранена", "success");
                    });
                } else {
                    DataService.updateOrCreate("tour", props.updateId, {
                        date: values.date,
                        sent: values.sent,
                    }).then((res) => {
                        props.closeDialog();
                        props.update();
                        showSnackbar("Запись обновлена", "success");
                    });
                }
            } catch (err) {
                console.log(err);
                showSnackbar("Ошибка при сохранении данных", "error");
            }
        }

        setErrors(error);
    };

    return (
        <form className={classes.root}>
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
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            autoOk
                            ampm={false}
                            disableFuture
                            value={new Date(values.date)}
                            onChange={handleDateChange}
                            label="Date"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton>
                                            <AlarmIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={6}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={values.sent}
                                onChange={handleChecboxChange}
                                name="sent"
                                color="primary"
                            />
                        }
                        label="Sent"
                    />
                </Grid>
                <Grid item xs={12}>
                    <div className={classes.alignButtons}>
                        <Button
                            variant="contained"
                            size="medium"
                            color="primary"
                            className={classes.margin}
                            onClick={props.closeDialog}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            size="medium"
                            color="primary"
                            className={classes.margin}
                            onClick={() => handleFormSubmit()}
                        >
                            Save
                        </Button>
                    </div>
                </Grid>
            </Grid>
        </form>
    );
}
