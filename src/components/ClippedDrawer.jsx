import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import StorageIcon from "@material-ui/icons/Storage";
import ContractsDataGrid from "./grids/ContractsDataGrid.jsx";
import LessonTypesDataGrid from "./grids/LessonTypesDataGrid.jsx";
import MastersDataGrid from "./grids/MastersDataGrid.jsx";
import ServiceCatsDataGrid from "./grids/ServiceCatsDataGrid.jsx";
import ServicesDataGrid from "./grids/ServicesDataGrid.jsx";
import TourDataGrid from "./grids/TourDataGrid.jsx";
import AuthService from "../services/AuthService.jsx";
import LoginForm from "./LoginForm.jsx";
import Button from "@material-ui/core/Button";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: "auto",
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
    },
}));

export default function ClippedDrawer() {
    const classes = useStyles();
    const [menuAction, setMenuAction] = React.useState("");
    const [login, setLogin] = React.useState(false);

    /**
     * Переключение между таблицами
     * @param {string} text
     */
    const menuClickAction = (text) => {
        setMenuAction(text);
    };

    const handleSignOut = () => {
        AuthService.out().then(() => {
            setLogin(null);
        });
    };

    React.useEffect(() => {
        AuthService.auth.onAuthStateChanged((user) => {
            setLogin(user);
        });
    }, []);

    return (
        <div>
            {login === null ? (
                <LoginForm login={() => setLogin(true)} />
            ) : login !== false ? (
                <div className={classes.root}>
                    <CssBaseline />
                    <AppBar position="fixed" className={classes.appBar}>
                        <Toolbar className={classes.toolbar}>
                            <Typography variant="h6" noWrap>
                                Admin firebase-database
                            </Typography>
                            <Button onClick={handleSignOut} variant="contained">
                                Выход
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        className={classes.drawer}
                        variant="permanent"
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                    >
                        <Toolbar />
                        <div className={classes.drawerContainer}>
                            <List>
                                {[
                                    "activity",
                                    "chat",
                                    "contracts",
                                    "lesson_types",
                                    "masters",
                                    "service_cats",
                                    "services",
                                    "tour",
                                ].map((text, index) => (
                                    <ListItem
                                        button
                                        key={text}
                                        selected={text === menuAction}
                                        onClick={() => menuClickAction(text)}
                                    >
                                        <ListItemIcon>
                                            <StorageIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={text} />
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                    </Drawer>
                    <main className={classes.content}>
                        <Toolbar />
                        {menuAction === "service_cats" ? (
                            <ServiceCatsDataGrid />
                        ) : menuAction === "services" ? (
                            <ServicesDataGrid />
                        ) : menuAction === "masters" ? (
                            <MastersDataGrid />
                        ) : menuAction === "tour" ? (
                            <TourDataGrid />
                        ) : menuAction === "contracts" ? (
                            <ContractsDataGrid />
                        ) : menuAction === "lesson_types" ? (
                            <LessonTypesDataGrid />
                        ) : (
                            ""
                        )}
                    </main>
                </div>
            ) : (
                ""
            )}
        </div>
    );
}
