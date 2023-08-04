import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  Divider,
  Drawer,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Modal,
  NativeSelect,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import ReplayIcon from "@mui/icons-material/Replay";
import React, { useState } from "react";
import {
  Create,
  Email,
  Inbox,
  IosShare,
  Outbox,
  Send,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const CircularProgressWithLabel = (props) => {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props} />
      <Box
        top={0}
        bottom={0}
        right={0}
        left={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {props.value === 100 ? "Full" : `${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
};
const FightCardListItem = ({ fightCard, itemVariant }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleOpenDrawer = () => setDrawerOpen(true);
  const handleCloseDrawer = () => {
    console.log(drawerOpen);
    setDrawerOpen(false);
  };
  const isCommited = fightCard.status === "Commited";

  const CurrentFightCardActions = ({ isCommited }) => {
    return (
      <Stack direction="column" spacing={1}>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          disabled={isCommited}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          startIcon={<VisibilityIcon />}
          onClick={handleOpenDrawer}
        >
          View
        </Button>
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          disabled={
            fightCard.status === "Full" || fightCard.status === "Commited"
              ? true
              : false
          }
        >
          Add Fight
        </Button>
        <Button
          variant="contained"
          disabled={fightCard.status === "Commited" ? true : false}
          color="success"
          startIcon={<CheckIcon />}
        >
          Commit
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          disabled={isCommited}
        >
          Delete
        </Button>
      </Stack>
    );
  };
  const PastFightCardActions = () => {
    return (
      <Stack direction="column" spacing={1}>
        <Button variant="contained" startIcon={<VisibilityIcon />}>
          View
        </Button>
        <Button variant="contained" startIcon={<ReplayIcon />}>
          Replay
        </Button>
      </Stack>
    );
  };

  const ViewFightCardFightsComponent = ({ fights }) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const Corner = ({ color }) => {
      const [exclusivity, setExclusivity] = useState("Open");
      const blueColor = "primary.dark";
      const redColor = "error.main";
      const handleSetExclusivity = (event) => {
        setExclusivity(event.target.value);
      };
      return (
        <Box
          border={3}
          height={200}
          flex={1}
          bgcolor={color === "Red" ? redColor : blueColor}
        >
          <Box textAlign="center" height="100%">
            <Typography color="primary.contrastText">{color} Corner</Typography>
            <Box height="100%">
              <ButtonGroup variant="contained" orientation="vertical">
                <Button
                  variant="contained"
                  endIcon={<Create />}
                  onClick={() => navigate("/gd/fighters")}
                >
                  Invite Fighters
                </Button>
                <Button
                  disabled={exclusivity === "InviteOnly"}
                  variant="contained"
                  endIcon={<Email />}
                  onClick={() => navigate("/mail/fight-requests")}
                >
                  Fight Requests
                </Button>
                <Box bgcolor="primary.contrastColor">
                  <FormControl fullWidth>
                    <InputLabel
                      variant="filled"
                      htmlFor="uncontrolled-native"
                      shrink
                      sx={{ color: "primary.contrastText" }}
                    >
                      Exclusivity
                    </InputLabel>
                    <NativeSelect
                      defaultValue={"Open"}
                      inputProps={{
                        name: "exclusivity",
                        id: "uncontrolled-native",
                      }}
                      onChange={handleSetExclusivity}
                    >
                      <option color="primary.contrastColor" value={"Open"}>
                        Open
                      </option>
                      <option
                        color="primary.contrastColor"
                        value={"InviteOnly"}
                      >
                        Invite Only
                      </option>
                    </NativeSelect>
                  </FormControl>
                </Box>
              </ButtonGroup>
            </Box>
          </Box>
        </Box>
      );
    };
    return (
      <Box height="100%" width="750px" role="presentation">
        <Box textAlign="center">
          <Typography variant="h3">
            FightCard Name | Arena | Name | Broadcaster | Date
          </Typography>
        </Box>
        {fights.map((item, key) => {
          return (
            <Box>
              <Box textAlign={"center"}>
                <Typography>
                  {key == 0 ? "Main Event" : "Fight " + (key + 1)}
                </Typography>
              </Box>
              <Stack direction="row" border={5}>
                <Corner color="Red" />
                <Box border={3} height={200} width={100}>
                  <Box textAlign="center" justifyItems="center" height="100%">
                    <Typography>VS</Typography>
                  </Box>
                </Box>
                <Corner color="Blue" />
              </Stack>
            </Box>
          );
        })}
      </Box>
    );
  };
  return (
    <>
      <Card>
        <Box textAlign="center" p="5px">
          <Typography variant="h4">{fightCard.title}</Typography>
          <Divider />
        </Box>
        <Stack direction="row">
          <Box width="50%">
            <CardContent>
              <Typography> Date: {fightCard.date}</Typography>
              <Typography> Fights: {fightCard.fights.length}</Typography>
              <Typography> Arena: {fightCard.arena.name}</Typography>
              <Typography>Broadcaster: {fightCard.broadcaster.name}</Typography>
              <Typography> Status: {fightCard.status}</Typography>
              {isCommited && <CheckIcon color="success" fontSize="large" />}
              {fightCard.arena.maxFights === fightCard.fights.length && (
                <CircularProgressWithLabel
                  value={
                    (fightCard.fights.length / fightCard.arena.maxFights) * 100
                  }
                />
              )}
              {fightCard.status === "Preparing" && (
                <CircularProgressWithLabel
                  value={
                    (fightCard.fights.length / fightCard.arena.maxFights) * 100
                  }
                />
              )}
            </CardContent>
          </Box>
          <Box minWidth="20%">
            <CardContent>
              <Box
                bgcolor="gray"
                borderColor="black"
                border={4}
                width="100px"
                height="100px"
                textAlign="center"
              >
                <Typography>Fight Card Score</Typography>
                <Divider />
                <Typography variant="h4">100</Typography>
              </Box>
            </CardContent>
          </Box>
          <Box alignSelf="right" width="30%" flexShrink={1}>
            <CardActions>
              <ButtonGroup
                orientation="vertical"
                variant="text"
                sx={{ width: "100%" }}
              >
                {itemVariant === "current" ? (
                  <CurrentFightCardActions isCommited={isCommited} />
                ) : (
                  <PastFightCardActions />
                )}
              </ButtonGroup>
            </CardActions>
          </Box>
        </Stack>
      </Card>
      <Drawer anchor="right" open={drawerOpen} onClose={handleCloseDrawer}>
        <ViewFightCardFightsComponent fights={fightCard.fights} />
      </Drawer>
    </>
  );
};

export default FightCardListItem;
