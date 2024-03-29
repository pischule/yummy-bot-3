import fs from "fs";
import { parseDocument } from "../dist/lib/parser.js";
import { stringToRects } from "../dist/lib/utils/util.js";

describe("abbyy task response parser", () => {
  it("it correctly parses 0807", async () => {
    const task = loadTask("0807");
    const rects = stringToRects(
      "116.413.440.524.505.414.814.528.142.571.442.674.509.568.810.674.137.711.464.825.513.711.802.828"
    );

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
      "ножка куриная фаршированная шампиньонами",
      "нагеттсы из филе птицы",
      "шницель «полесский»",
      "жаркое по-домашнему со свининой",
    ]);
  });

  it("it correctly parses 0508", async () => {
    const task = loadTask("0508");
    const rects = stringToRects(
      "116.413.440.524.505.414.814.528.142.571.442.674.509.568.810.674.137.711.464.825.513.711.802.828"
    );

    let items = await parseDocument(task, rects);

    expect(items).toEqual([
      "оливье с курицей",
      "салат «мозайка»",
      "салат с крабовыми палочками и кукурузой",
      "б о р и надел ька м и",
      "картофельное пюре",
      "каша перловая с грибами",
      "рис по-провански",
      "«морской дуэт» рыбная котлета с крабовыми палочками",
      "жаркое по-домашнему со свининой",
      "отбивная из филе птицы",
      "котлета по-албански",
    ]);
  });

  it("it correctly parses 1608", async () => {
    const task = loadTask("1608");
    const rects = stringToRects(
      "116.413.440.524.505.414.814.528.142.571.442.674.509.568.810.674.137.711.464.825.513.711.802.828"
    );

    let items = await parseDocument(task, rects);

    expect(items).toEqual([
      "салат «крабушка»",
      "салат «ассорти»",
      "салат с курицей и свеклой",
      "(^^асолевый с курицей",
      "рис по-мексикански",
      "картофель тушеный со сметаной",
      "спагетти с весенними овощами",
      "люля-кебаб из птицы",
      "филе птицы с грибами",
      "биточек из филе птицы с зеленью",
      "котлета «киевская»",
    ]);
  });

  it("it correctly parses 1808", async () => {
    const task = loadTask("1808");
    const rects = stringToRects(
      "116.413.440.524.505.414.814.528.142.571.442.674.509.568.810.674.137.711.464.825.513.711.802.828"
    );

    let items = await parseDocument(task, rects);

    expect(items).toEqual([
      "салат из квашеной капусты",
      "салат «пекинский»",
      "салат с курицей и свеклой",
      "бо^холодный со сметаной",
      "гречневая с морковью",
      "картофель тушеный со сметаной",
      "спагетти с соусом болоньезе",
      "драники по-домашнему",
      "жареная рыба под маринадом",
      "биточек по-белорусски",
      "филе птицы с ананасом",
      "жульен из птицы в тарталетке",
    ]);
  });

  it("it correctly parses 1908", async () => {
    const task = loadTask("1908");
    const rects = stringToRects(
      "116.413.440.524.505.414.814.528.142.571.442.674.509.568.810.674.137.711.464.825.513.711.802.828"
    );

    let items = await parseDocument(task, rects);

    expect(items).toEqual([
      "оливье с курицей",
      "салат «мозайка»",
      "салат с крабовыми палочками и кукурузой",
      "б о р и ка дел ька м и",
      "картофельное пюре",
      "каша перловая с грибами",
      "рис по-провански",
      "«морской дуэт» рыбная котлета с крабовыми палочками",
      "жаркое по-домашнему со свининой",
      "отбивная из филе птицы",
      "котлета по-албански",
    ]);
  });
});

function loadTask(date) {
  return fs.readFileSync(`test/task/${date}-task.xml`, "utf-8");
}
