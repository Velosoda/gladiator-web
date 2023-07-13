import { ArrowDropDown, OpenInBrowserSharp } from "@mui/icons-material";
import {
  Box,
  Button,
  Collapse,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FightCardListItem from "promotion/components/FightCardListItem";
import React, { useState } from "react";

const fightCards = [
  {
    title: "Fight Card 1: Fighter 1 vs Fighter 2",
    fights: [1, 2, 3, 4, 5],
    date: new Date().toString(),
    status: "Full",
    arena: {
      name: "Arena Name",
      seats: 10000,
      pricePerSeat: 10,
      prestige: 3,
      arenasCut: 10,
      maxFights: 5,
    },
    broadcaster: {
      name: "Broadcaster Name",
      acronym: "BN",
      prestige: 5,
    },
  },
  {
    title: "Fight Card 2: Fighter 1 vs Fighter 2",
    fights: [1, 2, 3],
    date: new Date().toString(),
    status: "Preparing",
    arena: {
      name: "Arena Name",
      seats: 10000,
      pricePerSeat: 10,
      prestige: 3,
      arenasCut: 10,
      maxFights: 5,
    },
    broadcaster: {
      name: "Broadcaster Name",
      acronym: "BN",
      prestige: 5,
    },
  },
  {
    title: "Fight Card 3: Fighter 1 vs Fighter 2",
    fights: [1, 2, 3, 4, 5],
    date: new Date().toString(),
    status: "Commited",
    arena: {
      name: "Arena Name",
      seats: 10000,
      pricePerSeat: 10,
      prestige: 3,
      arenasCut: 10,
      maxFights: 5,
    },
    broadcaster: {
      name: "Broadcaster Name",
      acronym: "BN",
      prestige: 5,
    },
  },
];

const FightCard = () => {
  const [open, setExpand] = useState(false);
  const broadcasters = [
    {
        label: "Broadcaster Name",
        value: "Broadcaster Name"
    }
  ]
  const arenas = [
      {

      }
    ]

  return (
    <Box>
      <Box textAlign="right" pt={2}>
        <IconButton onClick={() => setExpand(!open)}>
          <Typography> Filters </Typography>
          <ArrowDropDown />
        </IconButton>
        <Collapse in={open}>
            <Stack direction="row" spacing={2}>
                <TextField
                    id="broadcaster"
                    select
                    label="Broadcaster"
                    helperText="Filter by Broadcaster"
                >
                    {broadcasters.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                    ))}
                </TextField>
                <TextField
                    id="arena"
                    select
                    label="Arena"
                    helperText="Filter by Arena"
                >
                    {arenas.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                    ))}
                </TextField>
            </Stack>
        </Collapse>
      </Box>
      <Stack width="100%" direction="column" spacing={2} p={2}>
        <Button variant="contained" color="success">
          Create A New Fight Card
        </Button>
        {fightCards.map((item, key) => (
          <Box key={key}>
            <FightCardListItem fightCard={item} itemVariant="current" />
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default FightCard;
