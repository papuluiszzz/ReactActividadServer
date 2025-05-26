import * as React from "react";
import { Grid } from "@mui/material";
import AgregarMascotaForm from "../components/AgregarMascotaForm";

interface Mascota {
    id: number;
    idMascota: number;
    nombre: string;
    raza: string;
    peso: string;
    idCliente: number;
}

interface Cliente {
    id: number;
    nombre: string;
}

const ModuloMascotas = () => {
    const [dataUsers, setDataUsers] = React.useState<Mascota[]>([]);
    const [clientes, setClientes] = React.useState<Cliente[]>([]);
    const [userToEdit, setUserToEdit] = React.useState<Mascota | null>(null);

    const fetchUsers = () => {
        fetch("http://localhost:8000/mascotas")
            .then((res) => res.json())
            .then((res) =>
                setDataUsers(res.data.map((u: any) => ({ ...u, id: u.idMascota })))
            )
            .catch((err) => console.error("Error al obtener mascotas", err));
    };

    const fetchClientes = () => {
        fetch("http://localhost:8000/clientes")
            .then((res) => res.json())
            .then((res) => setClientes(res.data))
            .catch((err) => console.error("Error al obtener clientes", err));
    };

    React.useEffect(() => {
        fetchUsers();
        fetchClientes();
    }, []);

    return (
        <Grid container justifyContent={"center"} marginTop={5}>
            <Grid item xs={12} md={6}>
                <AgregarMascotaForm
                    userToEdit={userToEdit}
                    onSuccess={() => {
                        fetchUsers();
                        setUserToEdit(null);
                    }}
                    usersList={dataUsers}
                    clientesList={clientes}
                    setUserToEdit={setUserToEdit}
                />
            </Grid>
        </Grid>
    );
};


export default ModuloMascotas;
