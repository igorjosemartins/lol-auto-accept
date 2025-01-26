import { Hexgate as HttpsClient, LcuClient as WsClient, auth, poll } from "hexgate";
import { acceptMatch } from "./requests.js";
import { waitingUserToQueueLog, searchingLog, matchFoundLog } from "./utils.js";

waitingUserToQueueLog();

const credentials = await poll(auth);

const https = new HttpsClient(credentials);
const ws = new WsClient(credentials);

let isAccepted = false;

ws.subscribe("OnJsonApiEvent_lol-lobby_v2_lobby", ({ data }) => {
  try {
    const { searchState } = data;
    if (searchState === "Invalid") {
      isAccepted = false;
      waitingUserToQueueLog();
    }

  } catch (error) {}
});

ws.subscribe("OnJsonApiEvent_lol-matchmaking_v1_search", async ({ data }) => {
  try {
    const { searchState, timeInQueue } = data;

    switch (searchState.toLowerCase()) {
      case "searching":
        searchingLog(timeInQueue);
        break;

      case "found":
        if (!isAccepted) {
          isAccepted = true;
          matchFoundLog();
          await acceptMatch(https);
        }

        break;
    }
  } catch (error) {}
});