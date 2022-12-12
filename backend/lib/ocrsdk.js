import { parseStringPromise } from "xml2js";
import { config } from "../config/config.js";

function getBasicAuthorization(username, password) {
  return "Basic " + Buffer.from(username + ":" + password).toString("base64");
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const authorization = getBasicAuthorization(
  config.abbyyUsername,
  config.abbyyPassword
);
const BASE_URL = "https://cloud-eu.ocrsdk.com";
const MAX_RETRIES = 5;

async function parseAndValidateResponse(body) {
  let taskResponse = await parseStringPromise(body);
  let task = taskResponse?.response?.task?.[0]?.$;
  if (task === null || task === undefined) {
    throw new Error("parsing error: empty task");
  }
  return task;
}

function validateResponseStatus(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
}

function isTaskActive(task) {
  const status = task.status;
  return status === "Queued" || status === "InProgress";
}

async function processImage(fileStream) {
  console.log("processImage");

  let response = await fetch(
    `${BASE_URL}/processImage?language=Russian&exportFormat=xml&profile=textExtraction`,
    {
      method: "POST",
      headers: {
        Authorization: authorization,
        "Content-Type": "image/jpeg",
      },
      body: fileStream,
    }
  );
  validateResponseStatus(response);
  let body = await response.text();
  return await parseAndValidateResponse(body);
}

async function getTaskStatus(task) {
  console.log("getTaskStatus");
  let response = await fetch(`${BASE_URL}/getTaskStatus?taskId=${task.id}`, {
    headers: {
      Authorization: authorization,
    },
  });
  validateResponseStatus(response);
  let body = await response.text();
  return await parseAndValidateResponse(body);
}

async function getDocument(task) {
  console.log("getDocument");
  let response = await fetch(task.resultUrl);
  if (response) return await response.text();
}

async function createTaskAndGetDocument(fileStream) {
  let task = await processImage(fileStream);
  for (let i = 0; i < MAX_RETRIES; ++i) {
    await wait(task.estimatedProcessingTime * 1000);
    try {
      task = await getTaskStatus(task);
      if (!isTaskActive(task)) {
        break;
      }
    } catch (err) {
      console.log("an error occured while getting task status", err);
    }
  }
  if (isTaskActive(task)) {
    throw new Error("ocr took too long to complete");
  }
  return await getDocument(task);
}

export { createTaskAndGetDocument };
