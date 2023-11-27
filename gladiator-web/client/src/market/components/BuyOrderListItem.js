import { Box, Button, ButtonGroup, Divider, Typography } from "@mui/material";
import React from "react";

const BuyOrderListItem = ({ assetType, conditions }) => {
  return (
    <Box
      width={"20%"}
      height={300}
      border={4}
      bgcolor="background.paper"
      boxShadow={10}
      borderRadius={3}
    >
      <Typography variant="h6" textAlign={"center"}>
        {" "}
        {assetType}
      </Typography>
      <Divider />
        <Typography variant="subtitle1" > Conditions: </Typography>
        {conditions.map((i, value) => {
            console.log(i,value)
            return(
                <Box>
                    <Typography variant="body1"> {value} </Typography>
                </Box>
            );
        })}
        <ButtonGroup orientation="horizontal" variant="text" fullWidth>
            <Button>
                Matches
            </Button>
            <Button>
                Matches
            </Button>

        </ButtonGroup>
    </Box>
  );
};

export default BuyOrderListItem;
