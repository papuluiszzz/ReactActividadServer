import React, { useEffect, useState } from "react";
import {
    Button,
    TextField,
    Box,
    Snackbar,
    Alert,
    Typography,
    Paper,
    CircularProgress,
    Grid,
    Fade,
    useTheme,
    useMediaQuery,
    Card,
    CardContent,
    Tooltip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import PetsIcon from '@mui/icons-material/Pets';
import CakeIcon from '@mui/icons-material/Cake';

interface FormMascota {
    idMascota: number | null;
    nombre: string;
    raza: string;
    especie: string;
    edad: string;
    idCliente: number;
}

interface Cliente {
    id: number;
    idCliente: number;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    password: string;
}

interface Props {
    userToEdit: FormMascota | null;
    onSuccess: () => void;
    usersList: FormMascota[];
    clientesList: Cliente[]; 
    setUserToEdit: (user: FormMascota | null) => void;
}

const AgregarMascotaForm: React.FC<Props> = ({ userToEdit, onSuccess, usersList, setUserToEdit, clientesList }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [formData, setFormData] = useState({
        nombre: '',
        raza: '',
        especie: '',
        edad: '',
        idCliente: '',
    });

    const [alert, setAlert] = useState<{ open: boolean; type: 'success' | 'error' | 'info'; message: string }>({
        open: false,
        type: 'success',
        message: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    useEffect(() => {
        if (userToEdit) {
            setFormData({
                nombre: userToEdit.nombre,
                raza: userToEdit.raza,
                especie: userToEdit.especie,
                edad: userToEdit.edad,
                idCliente: userToEdit.idCliente.toString(),
            });
        } else {
            setFormData({ nombre: '', raza: '', especie: '', edad: '', idCliente: '' });
        }
    }, [userToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFocus = (fieldName: string) => {
        setFocusedField(fieldName);
    };

    const handleBlur = () => {
        setFocusedField(null);
    };

    const handleCloseAlert = () => {
        setAlert(prev => ({ ...prev, open: false }));
    };

    const resetForm = () => {
        setUserToEdit(null);
        setFormData({ nombre: '', raza: '', especie: '', edad: '', idCliente: '' });
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
        if (!formData.raza.trim()) {
            setAlert({
                open: true,
                type: 'error',
                message: 'La raza es obligatoria',
            });
            return false;
        }
        if (!formData.especie.trim()) {
            setAlert({
                open: true,
                type: 'error',
                message: 'La especie es obligatoria',
            });
            return false;
        }
        if (!formData.edad.trim()) {
            setAlert({
                open: true,
                type: 'error',
                message: 'La edad es obligatoria',
            });
            return false;
        }
        if (!formData.idCliente.trim()) {
            setAlert({
                open: true,
                type: 'error',
                message: 'Debe seleccionar un cliente',
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

        const url = 'http://localhost:8000/mascota';
        const method = userToEdit ? 'PUT' : 'POST';

        const payload = userToEdit ? {
            idMascota: userToEdit.idMascota,
            nombre: formData.nombre,
            raza: formData.raza,
            especie: formData.especie,
            edad: formData.edad,
            idCliente: parseInt(formData.idCliente),
        }
            : {
                nombre: formData.nombre,
                raza: formData.raza,
                especie: formData.especie,
                edad: formData.edad,
                idCliente: parseInt(formData.idCliente),
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
                        ? `¡Mascota ${formData.nombre} actualizada exitosamente!`
                        : `¡Mascota ${formData.nombre} creada exitosamente!`,
                });
                onSuccess();
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
                message: err.message || 'Ocurrió un error al guardar la mascota',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Fade in={true} timeout={500}>
            <Card
                elevation={4}
                sx={{
                    borderRadius: 3,
                    overflow: 'visible',
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: `0 10px 40px -10px ${alpha(theme.palette.primary.main, 0.2)}`,
                    position: 'relative',
                }}
            >
                <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
                            <Typography
                                variant="h5"
                                fontWeight="600"
                                color="primary"
                                sx={{
                                    letterSpacing: '0.5px'
                                }}
                            >
                                {userToEdit ? 'Actualizar Mascota' : 'Registro de Mascota'}
                            </Typography>
                        </Box>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="nombre"
                                    label="Nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('nombre')}
                                    onBlur={handleBlur}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <PersonIcon
                                                color={focusedField === 'nombre' ? 'primary' : 'action'}
                                                sx={{ mr: 1 }}
                                            />
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            transition: theme.transitions.create(['box-shadow']),
                                            ...(focusedField === 'nombre' && {
                                                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`
                                            })
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="raza"
                                    label="Raza"
                                    value={formData.raza}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('raza')}
                                    onBlur={handleBlur}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <BadgeIcon
                                                color={focusedField === 'raza' ? 'primary' : 'action'}
                                                sx={{ mr: 1 }}
                                            />
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            transition: theme.transitions.create(['box-shadow']),
                                            ...(focusedField === 'raza' && {
                                                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`
                                            })
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="especie"
                                    label="Especie"
                                    value={formData.especie}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('especie')}
                                    onBlur={handleBlur}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <PetsIcon
                                                color={focusedField === 'especie' ? 'primary' : 'action'}
                                                sx={{ mr: 1 }}
                                            />
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            transition: theme.transitions.create(['box-shadow']),
                                            ...(focusedField === 'especie' && {
                                                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`
                                            })
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="edad"
                                    label="Edad (años)"
                                    value={formData.edad}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('edad')}
                                    onBlur={handleBlur}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    type="number"
                                    InputProps={{
                                        startAdornment: (
                                            <CakeIcon
                                                color={focusedField === 'edad' ? 'primary' : 'action'}
                                                sx={{ mr: 1 }}
                                            />
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            transition: theme.transitions.create(['box-shadow']),
                                            ...(focusedField === 'edad' && {
                                                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`
                                            })
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="idCliente"
                                    label="ID Cliente"
                                    value={formData.idCliente}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('idCliente')}
                                    onBlur={handleBlur}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    type="number"
                                    InputProps={{
                                        startAdornment: (
                                            <PersonIcon
                                                color={focusedField === 'idCliente' ? 'primary' : 'action'}
                                                sx={{ mr: 1 }}
                                            />
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            transition: theme.transitions.create(['box-shadow']),
                                            ...(focusedField === 'idCliente' && {
                                                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`
                                            })
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mt: 4,
                                '& .MuiButton-root': {
                                    borderRadius: 2,
                                    py: 1.5,
                                    px: 4,
                                    fontWeight: 500,
                                    letterSpacing: '0.5px',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover:not(:disabled)': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 6px 20px -5px ${alpha(theme.palette.primary.main, 0.4)}`
                                    }
                                }
                            }}
                        >
                            <Tooltip title={userToEdit ? "Guardar cambios de la mascota" : "Registrar nueva mascota"}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={isSubmitting}
                                    startIcon={userToEdit ? <SystemUpdateAltIcon /> : <PersonAddAltIcon />}
                                    sx={{
                                        backgroundColor: theme.palette.primary.main,
                                        boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                                        '&:hover': {
                                            backgroundColor: theme.palette.primary.dark,
                                        }
                                    }}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                                            {userToEdit ? 'Actualizando...' : 'Registrando...'}
                                        </>
                                    ) : (
                                        userToEdit ? 'Actualizar Mascota' : 'Registrar Mascota'
                                    )}
                                </Button>
                            </Tooltip>
                        </Box>
                    </Box>
                </CardContent>

                <Snackbar
                    open={alert.open}
                    autoHideDuration={6000}
                    onClose={handleCloseAlert}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseAlert} severity={alert.type} sx={{ width: '100%' }}>
                        {alert.message}
                    </Alert>
                </Snackbar>
            </Card>
        </Fade>
    );
};

export default AgregarMascotaForm;