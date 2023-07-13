import React from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MapIcon from "@mui/icons-material/Map";
import RocketIcon from "@mui/icons-material/Rocket";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import HomeIcon from "@mui/icons-material/Home";
import Inventory2Icon from "@mui/icons-material/Inventory2";

const menu = [
  //Home
  {
    icon: <HomeIcon />,
    title: "Home",
    link: "/user/home",
    items: [],
  },
  //Promotion
  {
    icon: <AssignmentIcon />,
    title: "Promotion",
    items: [
      {
        title: "Fight Cards",
        link: "/promotion/fight-cards",
        items: [],
      },
      {
        title: "Marketing",
        link: "/promotion/marketing",
        items: [],
      },
      {
        title: "Roster",
        link: "/promotion/roster",
        items: [],
      },
      {
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
        title: "View Map",
        link: "/map/view",
        items: [],
      },
      {
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
        title: "View Ship",
        link: "/ship/view",
        items: [],
      },
      {
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
        title: "Buy",
        link: "/market/buy",
        items: [],
      },
      {
        title: "Sell",
        link: "/market/sell",
        items: [],
      },
      {
        title: "My Orders",
        link: "/market/my-orders",
        items: [],
      },
      {
        title: "Past Orders",
        link: "/market/past-orders",
        items: [],
      },
      {
        title: "Stats",
        link: "/market/stats",
        items: [],
      },
    ],
  },
  //Inventory
  {
    icon: <Inventory2Icon />,
    title: "Inventory",
    link: "/inventory",
    items: [],
  },
];

export default menu;
