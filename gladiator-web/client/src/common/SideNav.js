import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { Box, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const hasChildren = (item) => {
    const { items: children } = item;
    
    if (children === undefined) {
        return false;
    }
    
    if (children.constructor !== Array) {
        return false;
    }
    
    if (children.length === 0) {
        return false;
    }
    
    return true;
};

const MenuItem = ({ item }) => {
    const Component = hasChildren(item) ? MultiLevel : SingleLevel;
    return <Component item={item}/>;
};

const SingleLevel = ({ item }) => {
    
const navigate = useNavigate();
  return (
    <ListItem button onClick={() => navigate(item.link)}>
      <ListItemIcon>{item.icon}</ListItemIcon>
      <ListItemText primary={item.title} />
    </ListItem>
  );
};
const MultiLevel = ({ item }) => {

  const { items: children } = item;
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.title} />
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {children.map((child, key) => (
            <MenuItem key={key} item={child}/>
          ))}
        </List>
      </Collapse>
    </>
  );
};

const SideNav = ({ menu }) => {

  return (
    <Stack width="25%">
      {menu.map((item, key) => (
        <MenuItem key={key} item={item}/>
      ))}
    </Stack>
  );
};

//   return (
//     <Box
//       border="5px"
//       display="flex"
//       alignItems="flex-start"
//       flexDirection="column"
//       p="5px"
//       bgcolor="blue"
//       width="10%"
//       height="100%"
//     >
//       <Typography color="white">Item 1</Typography>
//       <Typography color="white">Item 1</Typography>
//       <Typography color="white">Item 1</Typography>
//       <Typography color="white">Item 1</Typography>
//       <Typography color="white">Item 1</Typography>
//     </Box>
export default SideNav;
