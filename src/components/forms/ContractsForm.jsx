import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Alert, AlertTitle } from "@material-ui/lab";
import DataService from "../../services/DataService.jsx";
import { useSnackbar } from "notistack";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

const initValues = {
    advantages: [],
    image_ref: "",
    short_info: "",
};

const useStyles = makeStyles((theme) => ({
    root: {
        "& .MuiFormControl-root": {
            marginBottom: theme.spacing(1),
            marginTop: theme.spacing(1),
        },
        "& .MuiGrid-item": {
            padding: theme.spacing(1),
        },
    },
    margin: {
        margin: theme.spacing(1),
    },
    alignButtons: {
        display: "flex",
        justifyContent: "flex-end",
    },
    addButtonCenter: {
        display: "flex",
        justifyContent: "center",
    },
}));

export default function ContractsForm(props) {
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
     * Обработка изменений в списке advantages
     * @param {int} id 
     * @returns 
     */
    const handleAdventegesChange = (id) => (event) => {
        const { name, value } = event.target;
        let advantagesEdit = values.advantages;
        advantagesEdit[id] = value;
        setValues({
            ...values,
            [name]: advantagesEdit,
        });
    };

    /**
     * Добавление элемента в список advantages
     */
    const handeleAddAdvantages = () => {
        let advantagesEdit = values.advantages;
        advantagesEdit.push("");
        setValues({
            ...values,
            advantages: advantagesEdit,
        });
    };

    /**
     * Удаление элемента из спика advantages
     * @param {int} id 
     * @returns 
     */
    const handleRemoveAdvanteges = (id) => (event) => {
        let advantagesEdit = values.advantages;
        advantagesEdit.splice(id, 1);
        setValues({
            ...values,
            advantages: advantagesEdit,
        });
    };

    /**
     * Запрос данных при редактировании и сброс формы
     */
    React.useEffect(() => {
        setValues({
            ...values,
            advantages: [],
        });
        if (props.updateId !== false) {
            DataService.getById("contracts", props.updateId)
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

        if (!values.image_ref) {
            error.push("image_ref");
        }

        if (!values.short_info) {
            error.push("short_info");
        }

        if (values.advantages.length === 0) {
            error.push("advantages");
        }

        if (error.length === 0) {
            let saveAdvantages = [];
            // фильтруем пустые advantages
            values.advantages.map(function (advantage) {
                if (advantage !== "" && advantage !== undefined) {
                    saveAdvantages.push(advantage);
                }
            });

            try {
                if (props.updateId === false) {
                    DataService.add("contracts", {
                        advantages: saveAdvantages,
                        image_ref: values.image_ref,
                        short_info: values.short_info,
                    }).then((res) => {
                        props.closeDialog();
                        props.update();
                        showSnackbar("Запись сохранена", "success");
                    });
                } else {
                    DataService.updateOrCreate("contracts", props.updateId, {
                        advantages: saveAdvantages,
                        image_ref: values.image_ref,
                        short_info: values.short_info,
                    }).then((res) => {
                        props.closeDialog();
                        props.update();
                        showSnackbar("Запись обновлена", "success");
                    });
                }
            } catch (err) {
                console.log(err.message);
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
                    <TextField
                        error={errors.indexOf("short_info") !== -1}
                        fullWidth
                        label="Short info"
                        variant="outlined"
                        name="short_info"
                        value={values.short_info}
                        onChange={handleInputChange}
                        helperText={
                            errors.indexOf("short_info") !== -1
                                ? errorText
                                : false
                        }
                    />
                </Grid>
                <Grid item xs={6}>
                    {values.advantages &&
                        values.advantages.map((advantage, index) => {
                            return (
                                <Grid key={index} container>
                                    <Grid item xs={11}>
                                        <TextField
                                            fullWidth
                                            label="Adventeges"
                                            variant="outlined"
                                            name="advantages"
                                            size="small"
                                            value={advantage}
                                            onChange={handleAdventegesChange(
                                                index
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <Tooltip title="Remove advantages">
                                            <IconButton
                                                color="primary"
                                                aria-label="remove advantages"
                                                component="span"
                                                onClick={handleRemoveAdvanteges(
                                                    index
                                                )}
                                            >
                                                <RemoveIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            );
                        })}

                    <Grid container>
                        <Grid item xs={12} className={classes.addButtonCenter}>
                            <Tooltip title="Add advantages">
                                <IconButton
                                    color="primary"
                                    aria-label="add advantages"
                                    component="span"
                                    onClick={handeleAddAdvantages}
                                >
                                    <AddIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
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
