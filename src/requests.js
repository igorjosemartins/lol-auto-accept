export const acceptMatch = async (https) => {
  const request = https.build('/lol-matchmaking/v1/ready-check/accept')
    .method('post')
    .create();

  return await request();
};