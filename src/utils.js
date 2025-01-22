export const formatTimer = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(mins).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

export const waitingUserToQueueLog = () => {
  console.log('\n'.repeat(process.stdout.rows || 100));
  console.clear();
  console.warn("waiting for user enter the queue...");
}