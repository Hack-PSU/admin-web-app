import { useController, UseControllerReturn } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { DateTime } from "luxon";

type RegisterDateTimePicker = {
  value: Date;
  onChange: UseControllerReturn["field"]["onChange"];
};

type DateTimeRangeType = "startDate" | "startTime" | "endDate" | "endTime";

export type UseDateTimeRange = {
  startDateTime: Date;
  endDateTime: Date;
  register(type: DateTimeRangeType): RegisterDateTimePicker;
  toggleMultiple(): void;
  isMultipleDays: boolean;
};

export function useDateTimeRange(
  name: string,
  options?: { isMultiple?: boolean }
): UseDateTimeRange {
  const {
    field: { onChange, value },
  } = useController({ name });

  const [startDate, setStartDate] = useState<Date>(value?.start ?? new Date());
  const [startTime, setStartTime] = useState<Date>(value?.start ?? new Date());

  const [endDate, setEndDate] = useState<Date>(value?.end ?? new Date());
  const [endTime, setEndTime] = useState<Date>(value?.end ?? new Date());

  const [isMultipleDays, setIsMultipleDays] = useState<boolean>(
    options?.isMultiple ?? false
  );

  const formatDate = useCallback((date: Date, time: Date) => {
    return DateTime.fromJSDate(date)
      .set({
        hour: time.getHours(),
        minute: time.getMinutes(),
        second: 0,
        millisecond: 0,
      })
      .toJSDate();
  }, []);

  const getValue = useCallback(() => {
    return [
      formatDate(startDate, startTime),
      formatDate(isMultipleDays ? endDate : startDate, endTime),
    ];
  }, [isMultipleDays, formatDate, startDate, startTime, endDate, endTime]);

  useEffect(() => {
    const [start, end] = getValue();
    onChange({ start, end });
  }, [name, getValue, onChange]);

  const toggleMultiple = useCallback(() => {
    setIsMultipleDays((multiple) => !multiple);
  }, []);

  return {
    register(type) {
      switch (type) {
        case "startDate":
          return {
            value: startDate,
            onChange: setStartDate,
          };
        case "startTime":
          return {
            value: startTime,
            onChange: setStartTime,
          };
        case "endDate":
          return {
            value: endDate,
            onChange: setEndDate,
          };
        case "endTime":
          return {
            value: endTime,
            onChange: setEndTime,
          };
      }
    },
    startDateTime: getValue()[0],
    endDateTime: getValue()[1],
    toggleMultiple,
    isMultipleDays,
  };
}
