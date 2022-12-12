import _ from "lodash";

function rectsToString(rects) {
  return rects
    .flatMap((r) => [r.l, r.t, r.r, r.b])
    .map((n) => Math.round(n * 1000))
    .join(".");
}

function stringToRects(string) {
  return _.chunk(
    string.split(".").map((i) => i / 1000),
    4
  ).map((r) => ({ l: r[0], t: r[1], r: r[2], b: r[3] }));
}

function escapeMarkdown(string) {
  const SPECIAL_CHARACTERS = "_*[]()~`>#+-=|{}.!".split("");
  SPECIAL_CHARACTERS.forEach((c) => (string = string.replaceAll(c, "\\" + c)));
  return string;
}

function convertTZ(date, tzString) {
  return new Date(
    (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
      timeZone: tzString,
    })
  );
}

function weekDayToString(day) {
  return [
    "воскресенье",
    "понедельник",
    "вторник",
    "среду",
    "четверг",
    "пятницу",
    "субботу",
  ][day];
}

export {
  stringToRects,
  rectsToString,
  convertTZ,
  escapeMarkdown,
  weekDayToString,
};
