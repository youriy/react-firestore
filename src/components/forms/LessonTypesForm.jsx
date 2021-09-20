import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Alert, AlertTitle } from "@material-ui/lab";
import DataService from "../../services/DataService.jsx";
import { useSnackbar } from "notistack";

const initValues = {
    description: "",
    image_ref: "",
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

export default function LessonTypesForm(props) {
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

    /**
     * Запрос данных при редактировании
     */
    React.useEffect(() => {
        if (props.updateId !== false) {
            console.log(props.updateId);
            DataService.getById("lesson_types", props.updateId)
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

        if (!values.description) {
            error.push("description");
        }

        if (!values.image_ref) {
            error.push("image_ref");
        }

        if (error.length === 0) {
            try {
                if (props.updateId === false) {
                    DataService.add("lesson_types", {
                        description: values.description,
                        image_ref: values.image_ref,
                    }).then((res) => {
                        props.closeDialog();
                        props.update();
                        showSnackbar("Запись сохранена", "success");
                    });
                } else {
                    DataService.updateOrCreate("lesson_types", props.updateId, {
                        description: values.description,
                        image_ref: values.image_ref,
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
                    <TextField
                        error={errors.indexOf("description") !== -1}
                        fullWidth
                        label="Description"
                        variant="outlined"
                        name="description"
                        value={values.description}
                        onChange={handleInputChange}
                        helperText={
                            errors.indexOf("description") !== -1
                                ? errorText
                                : false
                        }
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        error={errors.indexOf("image_ref") !== -1}
                        fullWidth
                        label="Image ref"
                        variant="outlined"
                        name="image_ref"
                        value={values.image_ref}
                        onChange={handleInputChange}
                        helperText={
                            errors.indexOf("image_ref") !== -1
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
