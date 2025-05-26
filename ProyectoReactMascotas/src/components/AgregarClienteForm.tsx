import React, { useEffect, useState } from "react";
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
import PhoneIcon from '@mui/icons-material/Phone';

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

    // Cambiado para usar los mismos nombres que la API
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
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
                nombre: userToEdit.nombre,
                apellido: userToEdit.apellido,
                telefono: userToEdit.telefono,
                email: userToEdit.email,
            });
        } else {
            setFormData({ nombre: '', apellido: '', telefono: '', email: '' });
        }
    }, [userToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCloseAlert = () => {
        setAlert(prev => ({ ...prev, open: false }));
    };

    const resetForm = () => {
        setUserToEdit(null);
        setFormData({ nombre: '', apellido: '', telefono: '', email: '' });
    };

    const handleUserSelect = (e: React.ChangeEvent<{ value: unknown }>) => {
        const selectedId = e.target.value as number;
        const selectedUser = usersList.find((u) => u.idCliente === selectedId);
        setUserToEdit(selectedUser || null);
    };

    const validateForm = () => {
        if (!formData.nombre.trim()) {
            setAlert({
                open: true,
                type: 'error',
                message: 'El nombre es obligatorio',
            });
            return false;
        }
        if (!formData.apellido.trim()) {
            setAlert({
                open: true,
                type: 'error',
                message: 'El apellido es obligatorio',
            });
            return false;
        }
        if (!formData.telefono.trim()) {
            setAlert({
                open: true,
                type: 'error',
                message: 'El teléfono es obligatorio',
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
        // Validación básica de teléfono
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.telefono.replace(/\s+/g, ''))) {
            setAlert({
                open: true,
                type: 'error',
                message: 'Ingrese un teléfono válido (10 dígitos)',
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

        // Simplificado el payload - usar directamente formData
        const payload = userToEdit ? {
            idCliente: userToEdit.idCliente,
            ...formData
        } : formData;

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            if (response.ok) {
                const responseData = await response.json();
                console.log('Response data:', responseData);
                
                setAlert({
                    open: true,
                    type: 'success',
                    message: userToEdit
                        ? `¡Usuario ${formData.nombre} actualizado exitosamente!`
                        : `¡Usuario ${formData.nombre} creado exitosamente!`,
                });
                onSuccess(); // recarga tabla y lista
                resetForm();
            } else {
                const errorData = await response.json().catch(() => null);
                console.error('Error response:', errorData);
                throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`);
            }
        } catch (err: any) {
            console.error('Error completo:', err);
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
                                name="nombre"
                                label="Nombre"
                                value={formData.nombre}
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
                                name="apellido"
                                label="Apellido"
                                value={formData.apellido}
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
                                label="Teléfono"
                                value={formData.telefono}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                                required
                                type="tel"
                                InputProps={{
                                    startAdornment: (
                                        <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
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