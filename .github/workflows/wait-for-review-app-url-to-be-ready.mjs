#!/usr/bin/env zx

async function waitForReviewAppUrlToBeReady(currentTry = 0) {
  const maxTries = 30;
  let response = {};
  try {
    response = await fetch(process.env.DROPLET_URL);
  } catch (_) {
    // ignored
  }
  if (!response.ok) {
    const waitSeconds = 5;
    console.log(`Application not ready, waiting ${waitSeconds} seconds`);
    await sleep(waitSeconds * 1000);
    if (currentTry >= maxTries) {
      console.error("Could not talk to review app in time");
      process.exit(1);
    }
    await waitForReviewAppUrlToBeReady(currentTry + 1);
  }
}

await waitForReviewAppUrlToBeReady();
