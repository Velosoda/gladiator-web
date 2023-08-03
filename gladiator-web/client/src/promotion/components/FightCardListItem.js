import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import ReplayIcon from "@mui/icons-material/Replay";
import React from "react";

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
        <Button variant="contained" startIcon={<VisibilityIcon />}>
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
              <Typography>
                {" "}
                Broadcaster: {fightCard.broadcaster.name}
              </Typography>
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
    </>
  );
};

export default FightCardListItem;
