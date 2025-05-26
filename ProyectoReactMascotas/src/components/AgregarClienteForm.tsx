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
        email: ''
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
                nombres: userToEdit.nombre,
                apellidos: userToEdit.apellido,
                telefono: userToEdit.telefono,
                email: userToEdit.email
                
            });
        } else {
            setFormData({ nombres: '', apellidos: '', telefono: '', email: '' });
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
        const selectedUser = usersList.find((u) => u.idCliente === selectedId);
        setUserToEdit(selectedUser || null);
    };

    const handleCloseAlert = () => {
        setAlert(prev => ({ ...prev, open: false }));
    };

    const resetForm = () => {
        setUserToEdit(null);
        setFormData({ nombres: '', apellidos: '', telefono:'', email: '' });
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

        const url = 'http://localhost:8000/clientes';
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

    const getInitials = (nombres: string, apellidos: string) => {
        const n = nombres.charAt(0).toUpperCase();
        const a = apellidos.charAt(0).toUpperCase();
        return n + a;
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
                                            <MenuItem key={u.idCliente} value={u.idCliente}>
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
                                                        {getInitials(u.nombre, u.apellido)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight="500">
                                                            {u.nombre} {u.apellido}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {u.email}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="nombres"
                                    label="Nombres"
                                    value={formData.nombres}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('nombres')}
                                    onBlur={handleBlur}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <PersonIcon
                                                color={focusedField === 'nombres' ? 'primary' : 'action'}
                                                sx={{ mr: 1 }}
                                            />
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            transition: theme.transitions.create(['box-shadow']),
                                            ...(focusedField === 'nombres' && {
                                                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`
                                            })
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="apellidos"
                                    label="Apellidos"
                                    value={formData.apellidos}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('apellidos')}
                                    onBlur={handleBlur}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <BadgeIcon
                                                color={focusedField === 'apellidos' ? 'primary' : 'action'}
                                                sx={{ mr: 1 }}
                                            />
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            transition: theme.transitions.create(['box-shadow']),
                                            ...(focusedField === 'apellidos' && {
                                                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`
                                            })
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="telefono"
                                    label="Telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('telefono')}
                                    onBlur={handleBlur}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <BadgeIcon
                                                color={focusedField === 'telefono' ? 'primary' : 'action'}
                                                sx={{ mr: 1 }}
                                            />
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            transition: theme.transitions.create(['box-shadow']),
                                            ...(focusedField === 'telefono' && {
                                                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`
                                            })
                                        }
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
                                    onFocus={() => handleFocus('email')}
                                    onBlur={handleBlur}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <EmailIcon
                                                color={focusedField === 'email' ? 'primary' : 'action'}
                                                sx={{ mr: 1 }}
                                            />
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            transition: theme.transitions.create(['box-shadow']),
                                            ...(focusedField === 'email' && {
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

                            <Tooltip title={userToEdit ? "Guardar cambios del usuario" : "Registrar nuevo usuario"}>
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
                                        userToEdit ? 'Actualizar usuario' : 'Registrar usuario'
                                    )}
                                </Button>
                            </Tooltip>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Fade>
    );

    return (
        <>
            <Main />

            <Snackbar
                open={alert.open}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                TransitionComponent={Fade}
            >
                <Alert
                    onClose={handleCloseAlert}
                    severity={alert.type}
                    variant="filled"
                    elevation={6}
                    sx={{
                        width: '100%',
                        borderRadius: 2,
                        boxShadow: `0 8px 32px ${alpha(
                            alert.type === 'success'
                                ? theme.palette.success.main
                                : alert.type === 'error'
                                    ? theme.palette.error.main
                                    : theme.palette.info.main,
                            0.2
                        )}`,
                        '& .MuiAlert-icon': {
                            fontSize: '1.5rem'
                        }
                    }}
                    action={
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={handleCloseAlert}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    {alert.message}
                </Alert>
            </Snackbar>

            <Backdrop
                sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 1 }}
                open={isSubmitting}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
};

export default AgregarClienteForm;