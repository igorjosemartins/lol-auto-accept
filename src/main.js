import { Hexgate as HttpsClient, auth, poll } from "hexgate";
import { acceptMatch, checkIfFoundMatch } from "./requests.js";

const credentials = await poll(auth);

const https = new HttpsClient(credentials);

const lolAutoAccept = async () => {
  try {
    const { data: { state, timer } } = await checkIfFoundMatch(https);
    
    if (state === "InProgress" && timer > 0) await acceptMatch(https);
    else console.log("\nfinding match...");
  
  } catch (e) {
    console.error("\nuser not in queue");
  }

  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return lolAutoAccept();
};

lolAutoAccept();