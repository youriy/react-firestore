import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import ServiceCatsForm from "./forms/ServiceCatsForm.jsx";
import ServicesForm from "./forms/ServicesForm.jsx";
import MastersForm from "./forms/MastersForm.jsx";
import TourForm from "./forms/TourForm.jsx";
import ContractsForm from "./forms/ContractsForm.jsx";
import LessonTypesForm from "./forms/LessonTypesForm.jsx";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: "relative",
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3),
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog(props) {
    const classes = useStyles();

    return (
        <div>
            <Dialog
                fullScreen
                open={props.open}
                onClose={props.close}
                TransitionComponent={Transition}
            >
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={props.close}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Add {props.typeForm}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Paper className={classes.pageContent}>
                    {props.typeForm === "service_cats" ? (
                        <ServiceCatsForm
                            closeDialog={props.close}
                            update={props.update}
                            updateId={props.updateId}
                        />
                    ) : props.typeForm === "services" ? (
                        <ServicesForm
                            closeDialog={props.close}
                            update={props.update}
                            updateId={props.updateId}
                        />
                    ) : props.typeForm === "masters" ? (
                        <MastersForm
                            closeDialog={props.close}
                            update={props.update}
                            updateId={props.updateId}
                        />
                    ) : props.typeForm === "tour" ? (
                        <TourForm
                            closeDialog={props.close}
                            update={props.update}
                            updateId={props.updateId}
                        />
                    ) : props.typeForm === "contracts" ? (
                        <ContractsForm
                            closeDialog={props.close}
                            update={props.update}
                            updateId={props.updateId}
                        />
                    ) : props.typeForm === "lesson_types" ? (
                        <LessonTypesForm
                            closeDialog={props.close}
                            update={props.update}
                            updateId={props.updateId}
                        />
                    ) : (
                        ""
                    )}
                </Paper>
            </Dialog>
        </div>
    );
}
