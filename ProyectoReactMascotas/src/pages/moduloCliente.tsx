import * as React from "react";
import { Grid } from "@mui/material";
import AgregarClienteForm from "../components/AgregarClienteForm";

interface Users {
    id: number;
    idCliente: number;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    password: string;
}

const ModuloClientes = () => {
    const [dataUsers, setDataUsers] = React.useState<Users[]>([]);
    const [userToEdit, setUserToEdit] = React.useState<Users | null>(null);

    const fetchUsers = () => {
        fetch("http://localhost:8000/clientes")
            .then((res) => res.json())
            .then((res) =>
                setDataUsers(res.data.map((u: any) => ({ ...u, id: u.idUsuario })))
            )
            .catch((err) => console.error("Error al obtener usuarios", err));
    };

    React.useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <Grid container justifyContent={"center"} marginTop={5}>
            <Grid item xs={12} md={6}>
                <AgregarClienteForm
                    userToEdit={userToEdit}
                    onSuccess={() => {
                        fetchUsers();
                        setUserToEdit(null);
                    }}
                    usersList={dataUsers}
                    setUserToEdit={setUserToEdit}
                />
            </Grid>
        </Grid>
    );
};

export default ModuloClientes;
