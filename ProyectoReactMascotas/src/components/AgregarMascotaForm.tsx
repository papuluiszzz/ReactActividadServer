import React, { useEffect, useState } from "react";
import {
    Button,
    TextField,
    Box,
    Snackbar,
    Alert,
    Typography,
    CircularProgress,
    Grid,
    Fade,
    useTheme,
    useMediaQuery,
    Card,
    CardContent,
    Tooltip,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
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
    edad: number;
    idCliente: number;
}

interface Cliente {
    id?: number;
    idCliente: number;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    password?: string;
}

interface Props {
    userToEdit: FormMascota | null;
    onSuccess: () => void;
    usersList: FormMascota[];
    setUserToEdit: (user: FormMascota | null) => void;
}

const AgregarMascotaForm: React.FC<Props> = ({ userToEdit, onSuccess, usersList, setUserToEdit }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Estado para los clientes (ahora se cargan internamente)
    const [clientesList, setClientesList] = useState<Cliente[]>([]);
    const [loadingClientes, setLoadingClientes] = useState(true);

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

    // Cargar clientes al montar el componente
    useEffect(() => {
        const cargarClientes = async () => {
            try {
                console.log('🔄 Cargando clientes desde API...');
                const response = await fetch('http://localhost:8000/cliente');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('✅ Respuesta completa de la API:', data);
                console.log('✅ Tipo de respuesta:', typeof data);
                console.log('✅ Es array directo:', Array.isArray(data));
                
                // Manejar diferentes formatos de respuesta
                let clientesArray = [];
                
                if (Array.isArray(data)) {
                    // Si la respuesta es directamente un array
                    clientesArray = data;
                    console.log('📋 Usando array directo');
                } else if (data && Array.isArray(data.clientes)) {
                    // Si la respuesta es un objeto con propiedad 'clientes'
                    clientesArray = data.clientes;
                    console.log('📋 Usando data.clientes');
                } else if (data && Array.isArray(data.data)) {
                    // Si la respuesta es un objeto con propiedad 'data'
                    clientesArray = data.data;
                    console.log('📋 Usando data.data');
                } else {
                    console.warn('⚠️ Formato de respuesta no reconocido:', data);
                    clientesArray = [];
                }
                
                console.log('📊 Clientes procesados:', clientesArray);
                console.log('📊 Número de clientes:', clientesArray.length);
                
                if (clientesArray.length > 0) {
                    console.log('👤 Primer cliente de ejemplo:', clientesArray[0]);
                }
                
                setClientesList(clientesArray);
            } catch (error) {
                console.error('❌ Error cargando clientes:', error);
                setAlert({
                    open: true,
                    type: 'error',
                    message: 'Error al cargar la lista de clientes',
                });
                setClientesList([]);
            } finally {
                setLoadingClientes(false);
            }
        };

        cargarClientes();
    }, []);

    useEffect(() => {
        if (userToEdit) {
            setFormData({
                nombre: userToEdit.nombre,
                raza: userToEdit.raza,
                especie: userToEdit.especie,
                edad: userToEdit.edad.toString(),
                idCliente: userToEdit.idCliente.toString(),
            });
        } else {
            setFormData({ nombre: '', raza: '', especie: '', edad: '', idCliente: '' });
        }
    }, [userToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (e: any) => {
        console.log('Cliente seleccionado:', e.target.value);
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
        
        const edadNum = parseInt(formData.edad);
        if (isNaN(edadNum) || edadNum < 0 || edadNum > 50) {
            setAlert({
                open: true,
                type: 'error',
                message: 'La edad debe ser un número válido entre 0 y 50 años',
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
            edad: parseInt(formData.edad),
            idCliente: parseInt(formData.idCliente),
        } : {
            nombre: formData.nombre,
            raza: formData.raza,
            especie: formData.especie,
            edad: parseInt(formData.edad),
            idCliente: parseInt(formData.idCliente),
        };

        try {
            console.log('Payload enviado:', payload);
            
            const response = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                const responseText = await response.text();
                let responseData;
                try {
                    responseData = responseText ? JSON.parse(responseText) : {};
                } catch {
                    responseData = { message: 'Operación exitosa' };
                }
                
                console.log('Response data:', responseData);
                
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
                const errorText = await response.text();
                let errorData;
                try {
                    errorData = errorText ? JSON.parse(errorText) : null;
                } catch {
                    errorData = { message: errorText || `Error ${response.status}` };
                }
                
                throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`);
            }
        } catch (err: any) {
            console.error('Error completo:', err);
            
            let errorMessage = 'Ocurrió un error al guardar la mascota';
            
            if (err.name === 'TypeError' && err.message.includes('fetch')) {
                errorMessage = 'Error de conexión. Verifique que el servidor esté ejecutándose.';
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setAlert({
                open: true,
                type: 'error',
                message: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderClientOptions = () => {
        if (loadingClientes) {
            return (
                <MenuItem value="" disabled>
                    <em>Cargando clientes...</em>
                </MenuItem>
            );
        }

        if (!clientesList || !Array.isArray(clientesList) || clientesList.length === 0) {
            return (
                <MenuItem value="" disabled>
                    <em>No hay clientes disponibles</em>
                </MenuItem>
            );
        }

        return clientesList.map((cliente, index) => {
            if (!cliente || !cliente.nombre || !cliente.apellido) {
                return null;
            }

            const clienteId = cliente.idCliente || cliente.id;
            if (clienteId === undefined || clienteId === null) {
                return null;
            }

            return (
                <MenuItem key={`cliente-${clienteId}-${index}`} value={clienteId.toString()}>
                    {`${cliente.nombre} ${cliente.apellido}`}
                </MenuItem>
            );
        }).filter(Boolean);
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
                                    inputProps={{ min: 0, max: 50 }}
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
                                <FormControl fullWidth variant="outlined" required>
                                    <InputLabel id="cliente-select-label">Seleccionar Cliente</InputLabel>
                                    <Select
                                        labelId="cliente-select-label"
                                        name="idCliente"
                                        value={formData.idCliente}
                                        onChange={handleSelectChange}
                                        label="Seleccionar Cliente"
                                        onFocus={() => handleFocus('idCliente')}
                                        onBlur={handleBlur}
                                        disabled={loadingClientes}
                                        startAdornment={
                                            <PersonIcon
                                                color={focusedField === 'idCliente' ? 'primary' : 'action'}
                                                sx={{ mr: 1, ml: 1 }}
                                            />
                                        }
                                        sx={{
                                            borderRadius: 2,
                                            transition: theme.transitions.create(['box-shadow']),
                                            ...(focusedField === 'idCliente' && {
                                                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`
                                            })
                                        }}
                                    >
                                        <MenuItem value="">
                                            <em>-- Seleccione un cliente --</em>
                                        </MenuItem>
                                        {renderClientOptions()}
                                    </Select>
                                </FormControl>

                                {/* Info de debug */}
                                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                                    {loadingClientes ? 'Cargando...' : `${clientesList.length} clientes disponibles`}
                                </Typography>
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
                                    disabled={isSubmitting || loadingClientes}
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