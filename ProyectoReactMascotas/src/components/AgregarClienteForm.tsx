const handleCloseAlert = () => {
        setAlert(prev => ({ ...prev, open: false }));
    };

    const resetForm = () => {
        setUserToEdit(null);
        setFormData({ nombres: '', apellidos: '', telefono:'', email: '' });
    };    const handleUserSelect = (e: React.ChangeEvent<{ value: unknown }>) => {
        const selectedId = e.target.value as number;
        const selectedUser = usersList.find((u) => u.idCliente === selectedId);
        setUserToEdit(selectedUser || null);
    };import React, { useEffect, useState } from "react";
import {
    Button,
    TextField,
    Box,
    Snackbar,
    Alert,
    Typography,
    CircularProgress,
    Divider,
    Grid,
    useTheme,
    useMediaQuery,
    Card,
    CardContent,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';

interface FormCliente {
    idCliente: number | null;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    
}

interface Props {
    userToEdit: FormCliente | null;
    onSuccess: () => void;
    usersList: FormCliente[];
    setUserToEdit: (user: FormCliente | null) => void;
}

const AgregarClienteForm: React.FC<Props> = ({ userToEdit, onSuccess, usersList, setUserToEdit }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        telefono:'',
        email: '',
    });

    const [alert, setAlert] = useState<{ open: boolean; type: 'success' | 'error' | 'info'; message: string }>({
        open: false,
        type: 'success',
        message: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (userToEdit) {
            setFormData({
                nombres: userToEdit.nombre,
                apellidos: userToEdit.apellido,
                telefono: userToEdit.telefono,
                email: userToEdit.email,
            });
        } else {
            setFormData({ nombres: '', apellidos: '', telefono: '', email: '' });
        }
    }, [userToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };



    const validateForm = () => {
        if (!formData.nombres.trim()) {
            setAlert({
                open: true,
                type: 'error',
                message: 'El nombre es obligatorio',
            });
            return false;
        }
        if (!formData.apellidos.trim()) {
            setAlert({
                open: true,
                type: 'error',
                message: 'El apellido es obligatorio',
            });
            return false;
        }
        if (!formData.email.trim()) {
            setAlert({
                open: true,
                type: 'error',
                message: 'El email es obligatorio',
            });
            return false;
        }
        // Validación básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setAlert({
                open: true,
                type: 'error',
                message: 'Ingrese un email válido',
            });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        console.log("Datos que se van a enviar", formData);

        const url = 'http://localhost:8000/cliente';
        const method = userToEdit ? 'PUT' : 'POST';

        const payload = userToEdit?{
            idCliente: userToEdit.idCliente,
            nombre: formData.nombres,
            apellido: formData.apellidos,
            telefono: formData.telefono,
            email: formData.email
        }
        :{
            nombre: formData.nombres,
            apellido: formData.apellidos,
            telefono: formData.telefono,
            email: formData.email
        }

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setAlert({
                    open: true,
                    type: 'success',
                    message: userToEdit
                        ? `¡Usuario ${formData.nombres} actualizado exitosamente!`
                        : `¡Usuario ${formData.nombres} creado exitosamente!`,
                });
                onSuccess(); // recarga tabla y lista
                resetForm();
            } else {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Error en el servidor');
            }
        } catch (err: any) {
            console.error(err);
            setAlert({
                open: true,
                type: 'error',
                message: err.message || 'Ocurrió un error al guardar el usuario',
            });
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <Card
            elevation={2}
            sx={{
                borderRadius: 2,
                bgcolor: 'background.paper',
            }}
        >
            <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Box display="flex" justifyContent="center" mb={3}>
                        <Typography
                            variant="h5"
                            fontWeight="600"
                            textAlign="center"
                        >
                            {userToEdit ? 'Actualizar Usuario' : 'Registro de Usuario'}
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    <Grid container spacing={3}>

                        <Grid item xs={12} md={6}>
                            <TextField
                                name="nombres"
                                label="Nombres"
                                value={formData.nombres}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                                required
                                InputProps={{
                                    startAdornment: (
                                        <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                name="apellidos"
                                label="Apellidos"
                                value={formData.apellidos}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                                required
                                InputProps={{
                                    startAdornment: (
                                        <BadgeIcon sx={{ mr: 1, color: 'action.active' }} />
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                name="telefono"
                                label="Telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                                required
                                InputProps={{
                                    startAdornment: (
                                        <BadgeIcon sx={{ mr: 1, color: 'action.active' }} />
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                name="email"
                                label="Correo electrónico"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                                required
                                InputProps={{
                                    startAdornment: (
                                        <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 4,
                        }}
                    >
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                            startIcon={userToEdit ? <SystemUpdateAltIcon /> : <PersonAddAltIcon />}
                            sx={{ minWidth: 200 }}
                        >
                            {isSubmitting ? (
                                <>
                                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                                    {userToEdit ? 'Actualizando...' : 'Registrando...'}
                                </>
                            ) : (
                                userToEdit ? 'Actualizar usuario' : 'Registrar usuario'
                            )}
                        </Button>
                    </Box>
                </Box>

                <Snackbar
                    open={alert.open}
                    autoHideDuration={6000}
                    onClose={handleCloseAlert}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert
                        onClose={handleCloseAlert}
                        severity={alert.type}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {alert.message}
                    </Alert>
                </Snackbar>
            </CardContent>
        </Card>
    );
};

export default AgregarClienteForm;