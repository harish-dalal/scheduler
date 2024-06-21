import React from "react";
import { Block } from "baseui/block";
import { TimePicker } from "baseui/timepicker";
import { SIZE } from "baseui/input";

export const SelectDate = () => {
  return (
    <Block>
      <TimePicker
        value={value}
        onChange={(date) => setValue(date)}
        size={SIZE.mini}
        creatable
        nullable
        placeholder="Time"
        minTime={new Date("2024-06-20T18:30:00.000Z")}
      />
    </Block>
  );
};
