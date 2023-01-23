import { promises as fs } from 'fs';

const cache = new Map();

async function readObj(name) {
  const cached = cache.get(name);
  if (cached) {
    return cached;
  }

  try {
    const data = await fs.readFile(`data/${name}.json`, "utf8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      return null;
    } else {
      throw err;
    }
  }
}

function saveObj(name, obj) {
  cache.set(name, obj);
  return fs.writeFile(`data/${name}.json`, JSON.stringify(obj));
}

async function readMenu() {
  const menu = await readObj("menu");
  if (menu === null || menu.items.length === 0) {
    return null;
  }

  menu.createDate = new Date(menu.createDate);
  menu.deliveryDate = new Date(menu.deliveryDate);

  const nowDate = new Date(new Date().toDateString());
  if (menu.createDate.getTime() !== nowDate.getTime()) {
    return null;
  }

  return menu;
}

export { readObj, saveObj, readMenu };
