import { Box, Stack } from "@mui/material";
import FightCardListItem from "promotion/components/FightCardListItem";
import React from "react";

const fightCards = [
    {
        title: "Fight Card 1: Fighter 1 vs Fighter 2",
        fights: [
            1,2,3,4,5
        ],
        date: new Date().toString(),
        status: "Full",
        arena: {
            name: "Arena Name",
            seats: 10000,
            pricePerSeat: 10,
            prestige: 3,
            arenasCut: 10,
            maxFights: 5
        },
        broadcaster: {
            name: "Broadcaster Name",
            acronym: "BN",
            prestige: 5,
        }
    },
    {
        title: "Fight Card 2: Fighter 1 vs Fighter 2",
        fights: [
            1,2,3
        ],
        date: new Date().toString(),
        status: "Preparing",
        arena: {
            name: "Arena Name",
            seats: 10000,
            pricePerSeat: 10,
            prestige: 3,
            arenasCut: 10,
            maxFights: 5
        },
        broadcaster: {
            name: "Broadcaster Name",
            acronym: "BN",
            prestige: 5,
        }
    },
    {
        title: "Fight Card 3: Fighter 1 vs Fighter 2",
        fights: [
            1,2,3,4,5
        ],
        date: new Date().toString(),
        status: "Commited",
        arena: {
            name: "Arena Name",
            seats: 10000,
            pricePerSeat: 10,
            prestige: 3,
            arenasCut: 10,
            maxFights: 5
        },
        broadcaster: {
            name: "Broadcaster Name",
            acronym: "BN",
            prestige: 5,
        }
    },
];

const PastFightCard = props => {
    return (
        <Stack flex={1} direction="column" spacing={2} p={2}>
        {fightCards.map((item, key) => (
                <Box key={key}>
                    <FightCardListItem fightCard={item} itemVariant="past"/>
                </Box>
            ))}
        </Stack>
    );
};

export default PastFightCard;