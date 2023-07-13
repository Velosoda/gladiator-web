import './App.css';
import * as React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import WatchPage  from 'watch/pages/WatchPage';
import TopNav from 'common/TopNav';
import CommunityPage from 'community/pages/CommunityPage';
import LoginPage from 'login/pages/LoginPage';
import LandingPage from 'landing/pages/LandingPage';
import HowToPlayPage from 'howtoplay/pages/HowToPlayPage';
import SideNav from 'common/SideNav';
import { Box } from '@mui/material';
import { Stack } from '@mui/system';


import menu from "./common/Menu"
import FightCard from 'promotion/pages/FightCard';
import Marketing from 'promotion/pages/Marketing';
import Roster from 'promotion/pages/Roster';
import PastFightCard from 'promotion/pages/PastFightCard';
import ViewMap from 'map/pages/ViewMap';
import Travel from 'map/pages/Travel';
import ViewShip from 'ship/pages/ViewShip';
import UpgradeShip from 'ship/pages/UpgradeShip';
import Stats from 'market/pages/Stats';
import PastOrders from 'market/pages/PastOrders';
import MyOrders from 'market/pages/MyOrders';
import Sell from 'market/pages/Sell';
import Buy from 'market/pages/Buy';
import Inventory from 'inventory/pages/Inventory';
import { UserHome } from 'userhome/pages/UserHome';
const App = () => {

 
  return (
    <Stack>
      <Router>  
        <TopNav 
          pages={
            [
              {
                text: "Watch",
                link: "/watch",
              },
              {
                text: "How To Play",
                link: "/how-to-play",
              },
              {
                text: "Community",
                link: "/community",
              } 
            ]
          } 
          settings={
            [
              {
                text: "Log In / Sign Up",
                link: "/login"
              }
            ]
          }
        />
        {/* if the user is logged in the side bar should show */}
        <Stack direction="row">
          <SideNav menu={menu}/>
          <Box>
            <Routes>
              {/* Top Bar */}
              <Route path="/" element={<LandingPage />}/>
              <Route path="/watch" element={<WatchPage />}/>
              <Route path="/how-to-play" element={<HowToPlayPage />}/>
              <Route path="/community" element={<CommunityPage />}/>
              <Route path="/login" element={<LoginPage />}/>
              {/* Side Bar */}
              {/* Promotion */}
              <Route path="/promotion/fight-cards" element={<FightCard />}/>
              <Route path="/promotion/marketing" element={<Marketing />}/>
              <Route path="/promotion/roster" element={<Roster />}/>
              <Route path="/promotion/past-fight-cards" element={<PastFightCard />}/>
              {/* Map */}
              <Route path="/map/view" element={<ViewMap />}/>
              <Route path="/map/travel" element={<Travel />}/>
              {/* Ship */}
              <Route path="/ship/view" element={<ViewShip />}/>
              <Route path="/ship/upgrade" element={<UpgradeShip />}/>
              {/* Market */}
              <Route path="/market/buy" element={<Buy />}/>
              <Route path="/market/sell" element={<Sell />}/>
              <Route path="/market/my-orders" element={<MyOrders />}/>
              <Route path="/market/past-orders" element={<PastOrders />}/>
              <Route path="/market/stats" element={<Stats />}/>
              {/* Inventory */}
              <Route path="/inventory" element={<Inventory />}/>
              {/* User Home */}
              <Route path="/user/home" element={<UserHome />}/>
            </Routes>
          </Box>
        </Stack>
      </Router>
    </Stack>
  );
}
export default App;