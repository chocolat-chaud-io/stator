#!/usr/bin/env zx

const projectName = process.env.REPO_NAME.split("/")[1];
const dropletName = `pr-${process.env.PR_NUMBER}`;
const firewallName = `${projectName}-review-apps`;
const loadBalancerName = `${projectName}-review-apps`;
const digitaloceanBaseUrl = "https://api.digitalocean.com/v2";
const headers = { Authorization: `Bearer ${process.env.DIGITALOCEAN_ACCESS_TOKEN}` };

const dropletPort = (await nothrow($`doctl compute droplet get ${dropletName}`)).stdout.split("port_")[1].split(",")[0];
await deleteFirewallRuleIfExists();
await deleteLoadBalancerRuleIfExists();
if (dropletPort) {
  await $`doctl compute droplet delete ${dropletName} --force`;
}

async function deleteFirewallRuleIfExists() {
  const firewallsResponse = await fetch(`${digitaloceanBaseUrl}/firewalls`, { headers });
  await checkResponseValidity(firewallsResponse, "Could not fetch firewall list:");

  const { firewalls: firewalls } = JSON.parse(await firewallsResponse.text());
  const firewall = firewalls.find(firewall => firewall.name === firewallName);
  const firewallRule = firewall?.inbound_rules?.find(rule => rule.ports === dropletPort);

  if (firewallRule) {
    const response = await fetch(`${digitaloceanBaseUrl}/firewalls/${firewall.id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        ...firewall,
        inbound_rules: firewall.inbound_rules.filter(rule => rule.ports !== dropletPort)
      })
    });
    await checkResponseValidity(response, "Could not remove firewall rule:");
  }
}

async function deleteLoadBalancerRuleIfExists() {
  const loadBalancerResponse = await fetch(`${digitaloceanBaseUrl}/load_balancers`, { headers });
  await checkResponseValidity(loadBalancerResponse, "Could not fetch load balancer list:");

  const { load_balancers } = JSON.parse(await loadBalancerResponse.text());
  const loadBalancer = load_balancers.find(loadBalancer => loadBalancer.name === loadBalancerName);
  const loadBalancerRule = loadBalancer?.forwarding_rules?.find(rule => rule.entry_port.toString() === dropletPort);

  if (loadBalancerRule) {
    delete loadBalancer.droplet_ids
    const response = await fetch(`${digitaloceanBaseUrl}/load_balancers/${loadBalancer.id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        ...loadBalancer,
        region: "nyc1",
        forwarding_rules: loadBalancer.forwarding_rules.filter(rule => rule.entry_port.toString() !== dropletPort)
      })
    });
    await checkResponseValidity(response, "Could not remove load balancer rule:");
  }
}

async function checkResponseValidity(response, message) {
  if (!response.ok) {
    console.error(message);
    console.error(await response.text());
    process.exit(1);
  }
}
