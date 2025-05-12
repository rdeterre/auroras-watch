type DayForecast = {
  date: Date;
  kindex: number;
};

export function noaa_parse_27_day_outlook(outlook: string): DayForecast[] {
  const lines = outlook.split("\n");

  return lines
    .map((line) => {
      if (line === "" || line.startsWith("#") || line.startsWith(":")) {
        return null;
      }
      const parts = line.trim().split(/\s+/);
      const year = parseInt(parts[0]);
      const monthString = parts[1];
      // Convert the month name to a month index
      const month = new Date(Date.parse(monthString + " 1")).getUTCMonth();
      const day = parseInt(parts[2]);
      // We can't just call Date("2025 May 05") because that gives a local time date
      const utcDate = new Date(Date.UTC(year, month, day));
      const kindex = parseInt(parts[parts.length - 1], 10);
      return { date: utcDate, kindex: kindex };
    })
    .filter((e) => e != null);
}
