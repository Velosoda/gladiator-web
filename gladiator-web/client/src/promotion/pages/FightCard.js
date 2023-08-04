import { ArrowDropDown } from "@mui/icons-material";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Radio,
} from "@mui/material";
import FightCardListItem from "promotion/components/FightCardListItem";
import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { max } from "lodash";

const tomorrow = dayjs().add(1, "day");

const todayNearestInterval = tomorrow.subtract(10, "minutes");

const fightCards = [
  {
    title: "Fight Card 1: Fighter 1 vs Fighter 2",
    fights: [1, 2, 3, 4, 5],
    date: new Date().toString(),
    status: "Full",
    arena: {
      name: "Arena Name",
      seats: 5000,
      pricePerSeat: 0,
      prestige: 0,
      cut: 0.1,
    },
    broadcaster: {
      name: "Broadcaster Name",
      acronym: "Bn",
      pricePerViewer: 30,
      minViewers: 0,
      maxViewers: 1000,
      prestige: 0,
      cut: 0.1,
    },
  },
  {
    title: "Fight Card 2: Fighter 1 vs Fighter 2",
    fights: [1, 2, 3],
    date: new Date().toString(),
    status: "Preparing",
    arena: {
      name: "Arena Name",
      seats: 5000,
      pricePerSeat: 0,
      prestige: 0,
      cut: 0.1,
    },
    broadcaster: {
      name: "Broadcaster Name",
      acronym: "Bn",
      pricePerViewer: 30,
      minViewers: 0,
      maxViewers: 1000,
      prestige: 0,
      cut: 0.1,
    },
  },
  {
    title: "Fight Card 3: Fighter 1 vs Fighter 2",
    fights: [1, 2, 3, 4, 5],
    date: new Date().toString(),
    status: "Commited",
    arena: {
      name: "Arena Name",
      seats: 5000,
      pricePerSeat: 0,
      prestige: 0,
      cut: 0.1,
    },
    broadcaster: {
      name: "Broadcaster Name",
      acronym: "Bn",
      pricePerViewer: 30,
      minViewers: 0,
      maxViewers: 1000,
      prestige: 0,
      cut: 0.1,
    },
  },
];

const broadcasters = [
  {
    name: "Broadcaster Name",
    acronym: "Bn",
    pricePerViewer: 30,
    minViewers: 0,
    maxViewers: 1000,
    prestige: 0,
    cut: 0.1,
  },
  {
    name: "Bringy Bongy Broadcasting",
    acronym: "BBB",
    pricePerViewer: 10,
    minViewers: 100,
    maxViewers: 40000,
    prestige: 3,
    cut: 0.3,
  },
  {
    name: "Bringy Bongy Broadcasting",
    acronym: "BBB",
    pricePerViewer: 10,
    minViewers: 100,
    maxViewers: 40000,
    prestige: 3,
    cut: 0.3,
  },
  {
    name: "Bringy Bongy Broadcasting",
    acronym: "BBB",
    pricePerViewer: 10,
    minViewers: 100,
    maxViewers: 40000,
    prestige: 3,
    cut: 0.3,
  },
  {
    name: "Bringy Bongy Broadcasting",
    acronym: "BBB",
    pricePerViewer: 10,
    minViewers: 100,
    maxViewers: 40000,
    prestige: 3,
    cut: 0.3,
  },
  {
    name: "Bringy Bongy Broadcasting",
    acronym: "BBB",
    pricePerViewer: 10,
    minViewers: 100,
    maxViewers: 40000,
    prestige: 3,
    cut: 0.3,
  },
  {
    name: "Bringy Bongy Broadcasting",
    acronym: "BBB",
    pricePerViewer: 10,
    minViewers: 100,
    maxViewers: 40000,
    prestige: 3,
    cut: 0.3,
  },
];
const arenas = [
  {
    name: "Arena Name",
    seats: 5000,
    pricePerSeat: 0,
    prestige: 0,
    cut: 0.1,
  },
  {
    name: "Bongy Arena",
    seats: 30000,
    pricePerSeat: 50,
    prestige: 10,
    cut: 0.55,
  },
  {
    name: "Bongy Arena",
    seats: 30000,
    pricePerSeat: 50,
    prestige: 10,
    cut: 0.55,
  },
  {
    name: "Bongy Arena",
    seats: 30000,
    pricePerSeat: 50,
    prestige: 10,
    cut: 0.55,
  },
  {
    name: "Bongy Arena",
    seats: 30000,
    pricePerSeat: 50,
    prestige: 10,
    cut: 0.55,
  },
  {
    name: "Bongy Arena",
    seats: 30000,
    pricePerSeat: 50,
    prestige: 10,
    cut: 0.55,
  },
];
const FightCard = () => {
  const [flexFightCards, setFlexFightCards] = useState(fightCards);
  const [expandFilters, setExpandFilters] = useState(false);
  const [expandCreateFightCardForm, setExpandCreateFightCardForm] =
    useState(false);
  const [selectedBroadcaster, setSelectedBroadcaster] = useState("0");
  const [selectedArena, setSelectedArena] = useState("0");
  const [selectedDateTime, setSelecetedDateTime] = useState(tomorrow);


  const handleSelectedBroadcasterChange = (event) => {
    console.log(event.target.value);
    setSelectedBroadcaster(event.target.value);
  };
  const handleSelectedDateTimeChange = (event) => {
    console.log(event.target.value);
    setSelecetedDateTime(event.target.value);
  };
  const handleSelectedArenaChange = (event) => {
    console.log(event.target.value);
    setSelectedArena(event.target.value);
  };

  const CalculateMaxViewers = () => {
    console.log(
      arenas[parseInt(selectedArena)].seats +
        broadcasters[parseInt(selectedBroadcaster)].maxViewers
    );
    new Intl.NumberFormat("en-US").format(
      arenas[parseInt(selectedArena)].seats +
        broadcasters[parseInt(selectedBroadcaster)].maxViewers
    );
    return (
      <Typography>
        {new Intl.NumberFormat("en-US").format(
          arenas[parseInt(selectedArena)].seats +
            broadcasters[parseInt(selectedBroadcaster)].maxViewers
        )}
      </Typography>
    );
  };
  const CalculateMaxEarnings = () => {
    let arena = arenas[parseInt(selectedArena)];
    let broadcaster = broadcasters[parseInt(selectedBroadcaster)];
    let total =
      arena.seats * arena.pricePerSeat +
      broadcaster.maxViewers * broadcaster.pricePerViewer;
    return (
      <Typography>{new Intl.NumberFormat("en-US").format(total)}</Typography>
    );
  };
  const CalculateMaxCut = () => {
    let arena = arenas[parseInt(selectedArena)];
    let broadcaster = broadcasters[parseInt(selectedBroadcaster)];
    const totalCut = arena.cut + broadcaster.cut;
    const maxEarnings =
      arena.seats * arena.pricePerSeat +
      broadcaster.maxViewers * broadcaster.pricePerViewer;
    const res = maxEarnings * totalCut;
    return (
      <Typography>{new Intl.NumberFormat("en-US").format(res)}</Typography>
    );
  };
  const CalculateMaxProfit = () => {
    let arena = arenas[parseInt(selectedArena)];
    let broadcaster = broadcasters[parseInt(selectedBroadcaster)];
    const totalCut = arena.cut + broadcaster.cut;
    const maxEarnings =
      arena.seats * arena.pricePerSeat +
      broadcaster.maxViewers * broadcaster.pricePerViewer;
    const profit = Math.ceil(maxEarnings - maxEarnings * totalCut);
    return (
      <Typography>{new Intl.NumberFormat("en-US").format(profit)}</Typography>
    );
  };
  const CreateNewFightCard = () => {
    console.log("Create Fight Card");
    let arena = arenas[parseInt(selectedArena)];
    let broadcaster = broadcasters[parseInt(selectedBroadcaster)];
    const item = {
      title: "Fight Card " + (flexFightCards.length + 1),
      fights: [1, 2, 3, 4, 5],
      date: selectedDateTime.toString(),
      status: "Request Sent",
      arena: arena,
      broadcaster: broadcaster,
    };
    console.log(item);
    let newArr = [...flexFightCards];
    newArr.push(item);
    setExpandCreateFightCardForm(false);
    return setFlexFightCards(newArr);
  };

  console.log("render: ", { selectedBroadcaster, selectedDateTime });

  return (
    <Box>
      <Box textAlign="right" pt={2}>
        <IconButton onClick={() => setExpandFilters(!expandFilters)}>
          <Typography> Filters </Typography>
          <ArrowDropDown />
        </IconButton>
        <Collapse in={expandFilters}>
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
      <Stack flex={1} direction="column" spacing={2} p={2}>
        <Button
          variant="contained"
          color="success"
          onClick={() =>
            setExpandCreateFightCardForm(!expandCreateFightCardForm)
          }
        >
          Create A New Fight Card
        </Button>
        <Collapse in={expandCreateFightCardForm}>
          <Stack
            spacing={3}
            useFlexGap
            maxHeight={1000}
            maxWidth="100%"
            border={2}
            p={2}
            borderRadius={3}
            overflow="scroll"
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                minDate={tomorrow}
                value={selectedDateTime}
                onChange={(newValue) => setSelecetedDateTime(newValue)}
                views={["year", "month", "day", "hours", "minutes"]}
                minutesStep={10}
                label="Select A Date/Time to Schedule This Fight Card"
              />
            </LocalizationProvider>
            <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" colSpan={6}>
                      Select A Broadcaster
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableHead>
                  <TableRow>
                    <TableCell
                      key={"broadcasterName"}
                      align="left"
                      style={{ minWidth: 50 }}
                    >
                      Name-Acronym
                    </TableCell>
                    <TableCell
                      key={"Min-Max Viewers"}
                      align="left"
                      style={{ minWidth: 50 }}
                    >
                      Min-Max Viewers
                    </TableCell>
                    <TableCell
                      key={"pricePerViewer"}
                      align="left"
                      style={{ minWidth: 50 }}
                    >
                      Price Per Viewer
                    </TableCell>
                    <TableCell
                      key={"broadcasterPrestige"}
                      align="left"
                      style={{ minWidth: 50 }}
                    >
                      Prestige
                    </TableCell>
                    <TableCell
                      key={"broadcasterCut"}
                      align="left"
                      style={{ minWidth: 50 }}
                    >
                      Cut
                    </TableCell>
                    <TableCell align="left" style={{ minWidth: 50 }}>
                      Select
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {broadcasters.map((row, index) => (
                    <TableRow
                      key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {`${row.name} - ${row.acronym}`}
                      </TableCell>
                      <TableCell align="left">{`${row.minViewers} - ${row.maxViewers}`}</TableCell>
                      <TableCell align="left">{`${row.pricePerViewer}`}</TableCell>
                      <TableCell align="left">{row.prestige}</TableCell>
                      <TableCell align="left">{`${Math.floor(
                        row.cut * 100
                      )}%`}</TableCell>
                      <TableCell align="left">
                        <Radio
                          checked={selectedBroadcaster === index.toString()}
                          onChange={handleSelectedBroadcasterChange}
                          value={index}
                          name="broadcaster-radio"
                          inputProps={{ "aria-label": index.toString() }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" colSpan={6}>
                      Select An Arena
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableHead>
                  <TableRow>
                    <TableCell
                      key={"arenaName"}
                      align="left"
                      style={{ minWidth: 50 }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      key={"seats"}
                      align="left"
                      style={{ minWidth: 50 }}
                    >
                      Seats
                    </TableCell>
                    <TableCell
                      key={"pricePerSeat"}
                      align="left"
                      style={{ minWidth: 50 }}
                    >
                      Price Per Seat
                    </TableCell>
                    <TableCell
                      key={"arenaPrestige"}
                      align="left"
                      style={{ minWidth: 50 }}
                    >
                      Prestige
                    </TableCell>
                    <TableCell
                      key={"arenaCut"}
                      align="left"
                      style={{ minWidth: 50 }}
                    >
                      Cut
                    </TableCell>
                    <TableCell align="left" style={{ minWidth: 50 }}>
                      Select
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {arenas.map((row, index) => (
                    <TableRow
                      key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {`${row.name}`}
                      </TableCell>
                      <TableCell align="left">{`${row.seats}`}</TableCell>
                      <TableCell align="left">{row.pricePerSeat}</TableCell>
                      <TableCell align="left">{row.prestige}</TableCell>
                      <TableCell align="left">{`${Math.floor(
                        row.cut * 100
                      )}%`}</TableCell>
                      <TableCell align="left">
                        <Radio
                          checked={selectedArena === index.toString()}
                          onChange={handleSelectedArenaChange}
                          value={index}
                          name="broadcaster-radio"
                          inputProps={{ "aria-label": index.toString() }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
              <Table size="small">
                {/* <TableHead>
                  <TableRow>
                    <TableCell align="center" colSpan={6}>
                      Totals
                    </TableCell>
                  </TableRow>
                </TableHead> */}
                <TableHead>
                  <TableRow>
                    <TableCell
                      key={"maxViewers"}
                      align="left"
                      style={{ minWidth: 50 }}
                    >
                      Max Viewers
                    </TableCell>
                    <TableCell
                      key={"maxEarnings"}
                      align="left"
                      style={{ minWidth: 50 }}
                    >
                      Max Earnings
                    </TableCell>
                    <TableCell
                      key={"maxTotalCut"}
                      align="left"
                      style={{ minWidth: 50 }}
                    >
                      Max Total Cut
                    </TableCell>
                    <TableCell
                      key={"maxProfit"}
                      align="left"
                      style={{ minWidth: 50 }}
                    >
                      Max Profit
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    key="totals"
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {CalculateMaxViewers()}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {CalculateMaxEarnings()}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {CalculateMaxCut()}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {CalculateMaxProfit()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Button
              onClick={CreateNewFightCard}
              variant="contained"
              disabled={selectedDateTime == tomorrow}
            >
              Submit
            </Button>
          </Stack>
        </Collapse>
        {flexFightCards.map((item, key) => (
          <Box key={key}>
            <FightCardListItem fightCard={item} itemVariant="current" />
          </Box>
        ))}
      </Stack>

    </Box>
  );
};

export default FightCard;
