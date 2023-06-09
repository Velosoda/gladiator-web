import * as React from 'react';
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";
import LoginIcon from '@mui/icons-material/Login';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box'
import { Typography } from '@mui/material';
import { MainNavBar }  from '../MainNavBar';

export const LandingPage = () => {

    const [alignment, setAlignment] = React.useState('login');
  
    const handleAlignment = (event, newAlignment) => {
      if (newAlignment !== null) {
        setAlignment(newAlignment);
      }
    };

    const LoginButtonMenu = () => {
        return (
            <Box textAlign={"center"}>
                <Typography variant="h2">Welcome to Name of the game</Typography>
                <Typography variant="subtitle1">Login or Sign Up to get started</Typography>
                <Stack direction="row" spacing={4} justifyContent="center">
                    <ToggleButtonGroup
                        value={alignment}
                        exclusive
                        onChange={handleAlignment}
                        aria-label="text alignment"
                    >
                        <ToggleButton value="login" aria-label="centered">
                            <Typography> Login </Typography>
                            <LoginIcon/>
                        </ToggleButton>
                        <ToggleButton value="signUp" aria-label="left aligned">
                            <Typography> Sign Up </Typography>
                            <AddBoxIcon /> 
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Stack>
            </Box>
        )
    }

    return (
        <Box>
            <MainNavBar 
                pages={['How To Play', 'Watch', 'Community', 'Login / Sign Up']} 
                subDirectory="landing"
            />
            <LoginButtonMenu/>
            { alignment === 'login' ? <LoginForm/> : <SignUpForm/> }
        </Box>
    );
}