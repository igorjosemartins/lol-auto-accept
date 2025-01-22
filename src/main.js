import { Hexgate as HttpsClient, LcuClient as WsClient, auth, poll } from "hexgate";
import { acceptMatch } from "./requests.js";
import { formatTimer, waitingUserToQueueLog } from "./utils.js";

waitingUserToQueueLog();

const credentials = await poll(auth);

const https = new HttpsClient(credentials);
const ws = new WsClient(credentials);

let isAccepted = false;

ws.subscribe("OnJsonApiEvent_lol-lobby_v2_lobby", ({ data }) => {
  try {
    const { searchState } = data;
    if (searchState === "Invalid") waitingUserToQueueLog();

  } catch (error) {}
});

ws.subscribe("OnJsonApiEvent_lol-matchmaking_v1_search", async ({ data }) => {
  try {
    const { searchState, timeInQueue } = data;

    switch (searchState.toLowerCase()) {
      case "searching":
        console.clear();
        console.log('\x1b[94m%s\x1b[0m', `[${formatTimer(timeInQueue)}] finding match...`);
        break;

      case "found":
        if (!isAccepted) {
          isAccepted = true;
          console.log('\x1b[32m%s\x1b[0m', "match found! accepting match...");
          await acceptMatch(https);
        }

        break;
    }
  } catch (error) {}
});