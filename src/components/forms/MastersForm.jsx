import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Alert, AlertTitle } from "@material-ui/lab";
import DataService from "../../services/DataService.jsx";
import { useSnackbar } from "notistack";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

const initValues = {
    achievements: [],
    specialization: [],
    top: false,
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

export default function MastersForm(props) {
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

    const handleChecboxChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.checked });
    };

    //-------------------------------------------------------------------------

    /**
     * Обработка изменений в списке achievements
     * @param {int} id
     * @returns
     */
    const handleAchievementsChange = (id) => (event) => {
        const { name, value } = event.target;
        let achievementsEdit = values.achievements;
        achievementsEdit[id] = value;
        setValues({ ...values, [name]: achievementsEdit });
    };

    /**
     * Добавление элемента в список achievements
     */
    const handeleAddAchievements = () => {
        let achievementsEdit = values.achievements;
        achievementsEdit.push("");
        setValues({ ...values, achievements: achievementsEdit });
    };

    /**
     * Удаление элемента из спика achievements
     * @param {int} id
     * @returns
     */
    const handleRemoveAchievements = (id) => (event) => {
        let achievementsEdit = values.achievements;
        achievementsEdit.splice(id, 1);
        setValues({ ...values, achievements: achievementsEdit });
    };

    //-------------------------------------------------------------------------

    /**
     * Обработка изменений в списке specialization
     * @param {int} id
     * @returns
     */
    const handleSpecializationChange = (id) => (event) => {
        const { name, value } = event.target;
        let specializationEdit = values.specialization;
        specializationEdit[id] = value;
        setValues({ ...values, [name]: specializationEdit });
    };

    /**
     * Добавление элемента в список specialization
     */
    const handeleAddSpecialization = () => {
        let specializationEdit = values.specialization;
        specializationEdit.push("");
        setValues({ ...values, specialization: specializationEdit });
    };

    /**
     * Удаление элемента из спика specialization
     * @param {int} id
     * @returns
     */
    const handleRemoveSpecialization = (id) => (event) => {
        let specializationEdit = values.specialization;
        specializationEdit.splice(id, 1);
        setValues({ ...values, specialization: specializationEdit });
    };

    //-------------------------------------------------------------------------------------

    /**
     * Запрос данных при редактировании
     */
    React.useEffect(() => {
        setValues({ ...values, achievements: [], specialization: [] });
        if (props.updateId !== false) {
            DataService.getById("masters", props.updateId)
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

        if (values.achievements.length === 0) {
            error.push("achievements");
        }

        if (values.specialization.length === 0) {
            error.push("specialization");
        }

        if (error.length === 0) {
            try {
                if (props.updateId === false) {
                    DataService.add("masters", {
                        achievements: values.achievements,
                        specialization: values.specialization,
                        top: values.top,
                    }).then((res) => {
                        props.closeDialog();
                        props.update();
                        showSnackbar("Запись сохранена", "success");
                    });
                } else {
                    DataService.updateOrCreate("masters", props.updateId, {
                        achievements: values.achievements,
                        specialization: values.specialization,
                        top: values.top,
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
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={values.top}
                                onChange={handleChecboxChange}
                                name="top"
                                color="primary"
                            />
                        }
                        label="Top"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={6}>
                            {values.achievements &&
                                values.achievements.map(
                                    (achievement, index) => {
                                        return (
                                            <Grid key={index} container>
                                                <Grid item xs={11}>
                                                    <TextField
                                                        fullWidth
                                                        label="Achievements"
                                                        variant="outlined"
                                                        name="achievements"
                                                        value={achievement}
                                                        onChange={handleAchievementsChange(
                                                            index
                                                        )}
                                                        size="small"
                                                    />
                                                </Grid>
                                                <Grid item xs={1}>
                                                    <Tooltip title="Remove achievements">
                                                        <IconButton
                                                            color="primary"
                                                            aria-label="remove achievements"
                                                            component="span"
                                                            onClick={handleRemoveAchievements(
                                                                index
                                                            )}
                                                        >
                                                            <RemoveIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grid>
                                            </Grid>
                                        );
                                    }
                                )}
                            <Grid container>
                                <Grid
                                    item
                                    xs={12}
                                    className={classes.addButtonCenter}
                                >
                                    <Tooltip title="Add advantages">
                                        <IconButton
                                            color="primary"
                                            aria-label="add advantages"
                                            component="span"
                                            onClick={handeleAddAchievements}
                                        >
                                            <AddIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={6}>
                            {values.specialization &&
                                values.specialization.map((spec, index) => {
                                    return (
                                        <Grid key={index} container>
                                            <Grid item xs={11}>
                                                <TextField
                                                    fullWidth
                                                    label="Specializations"
                                                    variant="outlined"
                                                    name="specialization"
                                                    value={spec}
                                                    onChange={handleSpecializationChange(
                                                        index
                                                    )}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={1}>
                                                <Tooltip title="Remove specialization">
                                                    <IconButton
                                                        color="primary"
                                                        aria-label="remove specializations"
                                                        component="span"
                                                        onClick={handleRemoveSpecialization(
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
                                <Grid
                                    item
                                    xs={12}
                                    className={classes.addButtonCenter}
                                >
                                    <Tooltip title="Add specializations">
                                        <IconButton
                                            color="primary"
                                            aria-label="add specializations"
                                            component="span"
                                            onClick={handeleAddSpecialization}
                                        >
                                            <AddIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
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
