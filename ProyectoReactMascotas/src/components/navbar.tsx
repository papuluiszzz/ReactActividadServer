import { Link } from "react-router-dom"
import { AppBar, Box, Toolbar, IconButton, Typography } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu'
import Drawer from "@mui/material/Drawer"
import Button from "@mui/material/Button"
import HomeIcon from '@mui/icons-material/Home'
import { useState } from "react"
import CreateIcon from '@mui/icons-material/Create'; 

const navItems = [
    { text: 'Inicio', path: '/', icon: <HomeIcon sx={{ color: '#fff' }} /> },
    { text: 'Agregar Cliente', path: '/moduloClientes', icon: <CreateIcon sx={{ color: '#fff' }} /> },
    { text: 'Agregar Mascota', path: '/moduloMascotas', icon: <CreateIcon sx={{ color: '#fff' }} /> },
]

const Navbar = () => {

    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerToogle = () => {
        setMobileOpen(!mobileOpen);
    }

    
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar sx={{ width: '100%', backgroundColor: '#1e1e1e' }}>
                <Toolbar>
                    <IconButton color="inherit" edge="start" onClick={handleDrawerToogle} sx={{ mr: 2, display: { sm: 'none' } }} > <MenuIcon/> </IconButton>
                    
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Servicio</Typography>

                    <Box sx={{ display: { xs: 'none', sm: 'flex', gap: 2 } }}>
                        {
                            navItems.map((item) => (
                                <Button key={item.text} component={Link} to={item.path} startIcon={item.icon} sx={{ color: '#fff', textTransform: 'none', '&:hover': { backgroundColor: '#333' }, }}>
                                    {item.text}
                                </Button>
                            ))
                        }
                    </Box>

                </Toolbar>
            </AppBar>
            { /*Menú para moviles*/}
            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToogle}
                ModalProps={{
                    keepMounted: true,
                }}

                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper':{
                        boxSizing:'border-box',
                        width: 240,
                        backgroundColor: '#1e1e1e',
                        color:'#fff',
                    },
                }}
            >

               
            </Drawer>
            <Toolbar />

        </Box>
    )
}

export default Navbar