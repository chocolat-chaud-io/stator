#!/usr/bin/env zx

const webappMainFileName = `./dist/apps/webapp/${(await $`ls dist/apps/webapp | grep main | grep -v LICENSE`).stdout.replace("\n", "")}`;
fs.readFile(webappMainFileName, "utf8", function(error, data) {
  if (error) {
    console.error(error);
    process.exit(1);
  }
  const result = data.replace(/apiUrl:`[a-zA-Z`{}\/:",\d_\-$.]+`/g, `apiUrl:"${process.env.DROPLET_URL}"`);

  fs.writeFile(webappMainFileName, result, "utf8", function(error) {
    if (error) {
      console.error(error);
      process.exit(1);
    }
  });
});
