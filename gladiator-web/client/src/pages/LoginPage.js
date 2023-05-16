import * as React from 'react';
import { LoginForm } from "../components/form/LoginForm";
import { SignUpForm } from "../components/form/SignUpForm";
import LoginIcon from '@mui/icons-material/Login';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box'
import { Typography } from '@mui/material';

export const LoginPage = () => {

    const [alignment, setAlignment] = React.useState('login');
  
    const handleAlignment = (event, newAlignment) => {
      if (newAlignment !== null) {
        setAlignment(newAlignment);
      }
    };

    return (
        <Box padding={2}>
            { alignment === 'login' ? <LoginForm/> : <SignUpForm/> }
            
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
    );
}