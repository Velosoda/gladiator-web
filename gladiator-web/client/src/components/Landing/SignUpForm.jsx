import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useState } from 'react';

export const SignUpForm = () => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [currentUser, setCurrentUser] = useState({})

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const loginInfo = {            
                "user":{
                    "username": data.get("username"),
                    "email": data.get("email"),
                    "password": data.get("password")
                }
            }
        console.log(loginInfo);

        fetch("/api/user/create", {
            method:'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(loginInfo)
        }).then(
            res => {
                if(res.status !== '422'){
                    setLoggedIn(true);
                    setCurrentUser(res.body);
                    console.log(res.body)
                }
                else{
                    setCurrentUser(res.body)
                    console.log(res.body)
                }
            }
        );
    };

    return (        
    <Container component="main" maxWidth="xs">
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            {/* <Typography component="h1" variant="h5">
                Sign Up
            </Typography> */}
            <Box 
                component="form" 
                onSubmit={handleSubmit} 
                noValidate sx={{ mt: 1 }}
            >
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Sign Up
                </Button>
            </Box>
        </Box>
    </Container>
    );
}