import React from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MapIcon from "@mui/icons-material/Map";
import RocketIcon from "@mui/icons-material/Rocket";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import HomeIcon from "@mui/icons-material/Home";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { ArrowCircleUp, ArrowDownward, ArrowUpward, BarChart, Celebration, CellTower, CorporateFare, Discount, Explore, Forward, Group, Groups2, History, Mail, MapsUgc, Outbox, Pending, PersonAdd, Search, South, SportsKabaddi, SportsMartialArts, Stadium, Storage, ViewAgenda, ViewDay, Visibility } from "@mui/icons-material";

const menu = [
  //Home
  {
    icon: <HomeIcon />,
    title: "Home",
    link: "/user/home",
    items: [],
  },
  //Mail
  {
    icon: <Mail />,
    title: "Mail",
    items: [
      {
        icon: <MapsUgc/>,
        title: "Fight Requests",
        link: "/mail/fight-requests",
        items: [],
      },
      {
        icon: <PersonAdd/>,
        title: "Friend Requests",
        link: "/mail/friend-requests",
        items: [],
      },
      {
        icon: <Forward/>,
        title: "Fight Invites",
        link: "/mail/fight-invites",
        items: [],
      },
    ],
  },
  //Promotion
  {
    icon: <AssignmentIcon />,
    title: "Promotion",
    items: [
      {
        icon: <ViewDay/>,
        title: "Fight Cards",
        link: "/promotion/fight-cards",
        items: [],
      },
      {
        icon: <Discount/>,
        title: "Marketing",
        link: "/promotion/marketing",
        items: [],
      },
      {
        icon: <Groups2/>,
        title: "Roster",
        link: "/promotion/roster",
        items: [],
      },
      {
        icon: <History/>,
        title: "Past Fight Cards",
        link: "/promotion/past-fight-cards",
        items: [],
      },
    ],
  },
  //Map
  {
    icon: <MapIcon />,
    title: "Map",
    items: [
      {
        icon: <Visibility/>,
        title: "View Map",
        link: "/map/view",
        items: [],
      },
      {
        icon: <Explore/>,
        title: "Travel",
        link: "/map/travel",
        items: [],
      },
    ],
  },
  //Ship
  {
    icon: <RocketIcon />,
    title: "Ship",
    items: [
      {
        icon:<Visibility/>,
        title: "View Ship",
        link: "/ship/view",
        items: [],
      },
      {
        icon:<ArrowCircleUp/>,
        title: "Upgrade Ship",
        link: "/ship/upgrade",
        items: [],
      },
    ],
  },
  //Market
  {
    icon: <ShowChartIcon />,
    title: "Market",
    items: [
      {
        icon: <ArrowDownward/>,
        title: "Buy",
        link: "/market/buy",
        items: [],
      },
      {
        icon: <ArrowUpward/>,
        title: "Sell",
        link: "/market/sell",
        items: [],
      },
      {
        icon: <Pending/>,
        title: "My Orders",
        link: "/market/my-orders",
        items: [],
      },
      {
        icon: <History/>,
        title: "Past Orders",
        link: "/market/past-orders",
        items: [],
      },
      {
        icon: <BarChart/>,
        title: "Stats",
        link: "/market/stats",
        items: [],
      },
    ],
  },
  //Database
  {
    icon: < Search/>,
    title: "Global Data",
    items: [
      {
        icon: <SportsMartialArts/>,
        title: "Fighters",
        link: "/gd/fighters",
        items: [],
      },
      {
        icon: <CorporateFare/>,
        title: "Promotions",
        link: "/gd/promotions",
        items: [],
      },
      {
        icon: <Stadium/>,
        title: "Arenas",
        link: "/gd/arenas",
        items: [],
      },
      {
        icon: <CellTower/>,
        title: "Broadcasters",
        link: "/gd/broadcasters",
        items: [],
      },
      {
        icon: <ViewDay/>,
        title: "Fight Cards",
        link: "/gd/fight-cards",
        items: [],
      },
      {
        icon: <SportsKabaddi/>,
        title: "Fights",
        link: "/gd/fights",
        items: [],
      },
      
      {
        icon: <Group/>,
        title: "Players",
        link: "/gd/players",
        items: [],
      },
      //Inventory
    ],
  },
  {
    icon: <Inventory2Icon />,
    title: "Inventory",
    link: "/inventory",
    items: [],
  },
];

export default menu;
