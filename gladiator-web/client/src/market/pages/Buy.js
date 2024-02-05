
import {
  Box,
  Button,
  Collapse,
  Stack,
} from "@mui/material";
import BuyOrderListItem from "market/components/BuyOrderListItem";
import React, { useState } from "react";
import BuyOrderForm from "market/components/BuyOrderForm";


export const AssetType = {
  Fighter: "Fighter",
  Trainer: "Trainer",
  Consumable: "Consumable",
  Building: "Building",
  Weapon: "Weapon",
  Armour: "Armour",
};
const buyOrders = [
  {
    assetType: AssetType.Fighter,
    constraints: [
      {
        name: "Jab",
        levelRange: [10, 40],
      },
      {
        attribute: "Speed",
        levelRange: [10, 15],
      },
      {
        priceRange: [1000, 4000],
      },
    ],
  },
];

const Buy = (props) => {
  // const [flexFightCards, setFlexFightCards] = useState(fightCards);
  const [expandCreateBuyOrderForm, setExpandCreateBuyOrderForm] =
    useState(false);

  const [flexBuyOrders, setFlexBuyOrders] = useState(buyOrders)


  return (
    <Box>
      <Stack flex={1} direction="column" spacing={2} p={2}>
        <Button
          variant="contained"
          color="success"
          onClick={() => setExpandCreateBuyOrderForm(!expandCreateBuyOrderForm)}
        >
          Create A New Buy Order
        </Button>
        <Collapse in={expandCreateBuyOrderForm}>
          <BuyOrderForm/>
        </Collapse>
        {flexBuyOrders.map((item, key) => (
          <Box key={key}>
            <BuyOrderListItem assetType={item.assetType} conditions={item.constraints}/>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default Buy;
