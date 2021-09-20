import React from "react";
import { DataGrid } from "@material-ui/data-grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Chip from "@material-ui/core/Chip";
import DataService from "../../services/DataService.jsx";
import FullScreenDialog from "../FullScreenDialog.jsx";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
    paperMarginBottom: {
        marginBottom: 10,
    },
    gridItem: {
        display: "flex",
        justifyContent: "flex-end",
    },
}));

export default function ContracsDataGrid() {
    const classes = useStyles();
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [pageSize, setPageSize] = React.useState(20);
    const [rows, setRows] = React.useState([]);
    const [updateId, setUpdateId] = React.useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const setDataRows = () => {
        DataService.getAllContracts().then((it) => {
            setRows(it);
        });
    };

    const showSnackbar = (message, variant) => {
        enqueueSnackbar(message, { variant: variant });
    };

    const handleDialogOpenUpdate = (id) => {
        setUpdateId(id);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setUpdateId(false);
    };


    const deleteRow = (id) => {
        DataService.delete(id, "contracts")
            .then(() => {
                setDataRows();
                showSnackbar("Запись удалена", "success");
            })
            .catch((error) => {
                console.log("Ошибка удаления services: " + error.message);
                showSnackbar("Ошибка при удалении записи", "error");
            });
    };

    React.useEffect(() => {
        setDataRows();
    }, []);

    const columns = [
        { field: "id", headerName: "ID", width: 100 },
        {
            field: "advantages",
            headerName: "Advantages",
            width: 690,
            renderCell: (params) => {
                return (
                    <List dense={true}>
                        {params.value.map(function (it, index) {
                            return (
                                <ListItem style={{ height: 28 }} key={index}>
                                    <Chip
                                        variant="outlined"
                                        size="small"
                                        label={it}
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                );
            },
        },
        {
            field: "image_ref",
            headerName: "Image ref",
            width: 310,
        },
        {
            field: "short_info",
            headerName: "Short info",
            width: 365,
        },
        {
            field: "action",
            headerName: "Action",
            width: 130,
            renderCell: (params) => {
                return (
                    <div>
                        <Tooltip title="Edit">
                            <IconButton
                                color="primary"
                                aria-label="edit row"
                                component="span"
                                onClick={() =>
                                    handleDialogOpenUpdate(params.value)
                                }
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton
                                color="secondary"
                                aria-label="delete row"
                                component="span"
                                onClick={() => deleteRow(params.value)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            <Grid container>
                <Grid item xs={12} className={classes.gridItem}>
                    <Button
                        variant="contained"
                        size="medium"
                        color="primary"
                        className={classes.margin}
                        onClick={() => setDialogOpen(true)}
                    >
                        Добавить
                    </Button>
                </Grid>
            </Grid>

            <div
                style={{ height: 885, width: "100%", backgroundColor: "white" }}
            >
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={pageSize}
                    rowsPerPageOptions={[20, 50, 100]}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    pagination
                    rowHeight={150}
                />
            </div>
            <FullScreenDialog
                open={dialogOpen}
                close={handleDialogClose}
                typeForm={"contracts"}
                update={setDataRows}
                updateId={updateId}
            />
        </div>
    );
}
