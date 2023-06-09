import * as React from 'react';
import Box from '@mui/material/Box'
import {MainNavBar}  from '../MainNavBar';

export const UserHome = () => {
    return (
        <Box>
            <MainNavBar
                pages={['Home', 'Market', 'Map', 'Promotion', 'Inventory', 'Watch']}
                settings={['Profile', 'Community', 'Settings', 'Logout']}
            />
        </Box>
    );
}