import React, { useEffect, useState } from "react";
import {
    Button,
    TextField,
    Box,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Snackbar,
    Alert,
    Typography,
    Paper,
    CircularProgress,
    IconButton,
    Divider,
    Grid,
    Fade,
    Backdrop,
    useTheme,
    useMediaQuery,
    Avatar,
    Chip,
    Card,
    CardContent,
    Tooltip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import PassIcon from '@mui/icons-material/Password';

interface FormMascota {
    idMascota: number | null;
    nombre: string;
    raza: string;
    peso: string;
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
        peso: '',
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
                peso: userToEdit.peso,
                idCliente: userToEdit.idCliente,
            });
        } else {
            setFormData({ nombre: '', raza: '', peso: '', idCliente: '' });
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

    const handleUserSelect = (e: React.ChangeEvent<{ value: unknown }>) => {
        const selectedId = e.target.value as number;
        const selectedUser = usersList.find((u) => u.idMascota === selectedId);
        setUserToEdit(selectedUser || null);
    };

    const handleCloseAlert = () => {
        setAlert(prev => ({ ...prev, open: false }));
    };

    const resetForm = () => {
        setUserToEdit(null);
        setFormData({ nombre: '', raza: '', peso: '', idCliente: '' });
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
        if (!formData.peso.trim()) {
            setAlert({
                open: true,
                type: 'error',
                message: 'El peso es obligatorio',
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

        const url = 'http://localhost:8000/mascotas';
        const method = userToEdit ? 'PUT' : 'POST';

        const payload = userToEdit ? {
            idMascota: userToEdit.idMascota,
            nombre: formData.nombre,
            raza: formData.raza,
            peso: formData.peso,
            idCliente: formData.idCliente,
        }
            : {
                nombre: formData.nombre,
                raza: formData.raza,
                peso: formData.peso,
                idCliente: formData.idCliente,
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
                        ? `¡Usuario ${formData.nombre} actualizado exitosamente!`
                        : `¡Usuario ${formData.nombre} creado exitosamente!`,
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

    const getInitials = (nombres: string) => {
        const n = nombres.charAt(0).toUpperCase();
        return n;
    };

    const getAvatarColor = (nombre: string) => {
        const colors = [
            theme.palette.primary.main,
            theme.palette.secondary.main,
            theme.palette.error.main,
            theme.palette.warning.main,
            theme.palette.info.main,
            theme.palette.success.main,
        ];

        const charSum = nombre.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        return colors[charSum % colors.length];
    };

    return (
        <Fade in={true} timeout={500}>
            <Card
                elevation={4}
                sx={{
                    borderRadius: 3,
                    overflow: 'visible',
                    background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${theme.palette.background.paper})`,
                    backdropFilter: 'blur(10px)',
                    boxShadow: `0 10px 40px -10px ${alpha(theme.palette.primary.main, 0.2)}`,
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '8px',
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        borderTopLeftRadius: '12px',
                        borderTopRightRadius: '12px',
                    }
                }}
            >
                <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                            <Typography
                                variant="h5"
                                fontWeight="600"
                                sx={{
                                    backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                {userToEdit ? 'Actualizar Usuario' : 'Registro de Usuario'}
                            </Typography>
                        </Box>

                        <Divider sx={{ mb: 4, opacity: 0.6 }} />

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="filled">
                                    <InputLabel id="user-select-label">Seleccionar usuario existente</InputLabel>
                                    <Select
                                        labelId="user-select-label"
                                        value={userToEdit?.idCliente ?? ''}
                                        onChange={handleUserSelect}
                                        sx={{
                                            borderRadius: 1.5,
                                            '& .MuiSelect-select': {
                                                py: 1.5
                                            }
                                        }}
                                    >
                                        <MenuItem value="">
                                            <Box display="flex" alignItems="center">
                                                <PersonAddAltIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                                                <Typography fontWeight="medium">Crear nuevo usuario</Typography>
                                            </Box>
                                        </MenuItem>
                                        <Divider />
                                        {usersList.map((u) => (
                                            <MenuItem key={u.idMascota} value={u.idMascota}>
                                                <Box display="flex" alignItems="center">
                                                    <Avatar
                                                        sx={{
                                                            width: 28,
                                                            height: 28,
                                                            mr: 1.5,
                                                            bgcolor: getAvatarColor(u.nombre),
                                                            fontSize: '0.75rem'
                                                        }}
                                                    >
                                                        {getInitials(u.nombre)}
                                                    </Avatar>
                                                    <Typography variant="body2">{u.nombre}</Typography>
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

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
                                    name="peso"
                                    label="Peso"
                                    value={formData.peso}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('peso')}
                                    onBlur={handleBlur}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <BadgeIcon
                                                color={focusedField === 'peso' ? 'primary' : 'action'}
                                                sx={{ mr: 1 }}
                                            />
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            transition: theme.transitions.create(['box-shadow']),
                                            ...(focusedField === 'peso' && {
                                                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`
                                            })
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth variant="filled">
                                    <InputLabel id="cliente-select-label">Seleccionar cliente</InputLabel>
                                    <Select
                                        labelId="cliente-select-label"
                                        value={formData.idCliente}
                                        onChange={(e) => setFormData({ ...formData, idCliente: e.target.value as string })}
                                        sx={{
                                            borderRadius: 1.5,
                                            '& .MuiSelect-select': {
                                                py: 1.5
                                            }
                                        }}
                                    >
                                        {clientesList.map((cliente) => (
                                            <MenuItem key={cliente.idCliente} value={cliente.idCliente}>
                                                <Box display="flex" alignItems="center">
                                                    <Avatar
                                                        sx={{
                                                            width: 28,
                                                            height: 28,
                                                            mr: 1.5,
                                                            bgcolor: getAvatarColor(cliente.nombre),
                                                            fontSize: '0.75rem'
                                                        }}
                                                    >
                                                        {getInitials(cliente.nombre)}
                                                    </Avatar>
                                                    <Typography variant="body2">{cliente.nombre}</Typography>
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>



                        </Grid>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: isMobile ? 'column' : 'row',
                                gap: 2,
                                mt: 4,
                                '& .MuiButton-root': {
                                    borderRadius: 2,
                                    py: 1.5,
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
                            <Tooltip title="Cancelar y limpiar formulario">
                                <Button
                                    fullWidth={isMobile}
                                    variant="outlined"
                                    color="error"
                                    onClick={resetForm}
                                    startIcon={<CancelOutlinedIcon />}
                                    disabled={isSubmitting}
                                    sx={{
                                        borderWidth: '2px',
                                        '&:hover': {
                                            borderWidth: '2px',
                                        }
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </Tooltip>

                            <Tooltip title={userToEdit ? "Guardar cambios de la mascota" : "Registrar nueva mascota"}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    disabled={isSubmitting}
                                    startIcon={userToEdit ? <SystemUpdateAltIcon /> : <PersonAddAltIcon />}
                                    sx={{
                                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                        boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
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
            </Card>
        </Fade>
    );

}
export default AgregarMascotaForm;