import { useCallback, useEffect, useState } from "react";
import { UseClipboardReturn, UseDateTime, UseDateTimeRange } from "types/hooks";
import { useController, UseFormReturn } from "react-hook-form";
import { DateTime } from "luxon";

export function useDateTime(name: string, methods: UseFormReturn): UseDateTime {
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(
    DateTime.fromFormat("01:00 AM", "hh:mm a").toJSDate()
  );

  const formatDate = useCallback(() => {
    return DateTime.fromJSDate(date).set({
      hour: time.getHours(),
      minute: time.getMinutes(),
    });
  }, [date, time]);

  useEffect(() => {
    methods.setValue(name, formatDate().toJSDate());
  }, [name, date, time, methods, formatDate]);

  return {
    dateTime: formatDate().toJSDate(),
    register(type) {
      if (type === "date") {
        return {
          value: date,
          onChange: setDate,
        };
      } else if (type === "time") {
        return {
          value: time,
          onChange: setTime,
        };
      }
    },
  } as UseDateTime;
}

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

export function useClipboard(): UseClipboardReturn {
  return {
    onClickToCopy(value) {
      void navigator.clipboard.writeText(value);
    },
  };
}
