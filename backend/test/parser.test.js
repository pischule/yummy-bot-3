import fs from "fs";
import { parseDocument } from "../lib/parser.js";

function loadTaskAndRects(date) {
  return {
    task: fs.readFileSync(`test/task/${date}-task.xml`, "utf-8"),
    rects: JSON.parse(fs.readFileSync(`test/task/${date}-rects.json`, "utf-8")),
  };
}

describe("abbyy task response parser", () => {
  it("it correctly parses 0807", async () => {
    const { task, rects } = loadTaskAndRects("0807");

    let items = await parseDocument(task, rects);

    expect(items).toEqual([
      "салат из свеклы с сыром фета",
      "салат «крабушка»",
      "салат «венгерский»",
      "бо^и^с^рикадельками",
      "картофель запеченный с прованскими травами",
      "рис с весенними овощами",
      "спагетти с маслом и зеленью",
      "рыбная котлета с зеленью",
      "ножка куриная фаршированная  шампиньонами",
      "нагеттсы из филе птицы",
      "шницель «полесский»",
      "жаркое по-домашнему со свининой",
    ]);
  });

  it("it correctly parses 0508", async () => {
    const { task, rects } = loadTaskAndRects("0508");

    let items = await parseDocument(task, rects);

    expect(items).toEqual([
      "оливье с курицей",
      "салат «мозайка»",
      "салат с крабовыми палочками и кукурузой",
      "б о р и надел ька м и",
      "картофельное пюре",
      "ка^ша перловая с грибами",
      "рис по-провански",
      "«морской дуэт» рыбная котлета с крабовыми палочками",
      "жаркое по-домашнему со свининой",
      "отбивная из филе птицы",
      "котлета по-албански",
    ]);
  });
});
