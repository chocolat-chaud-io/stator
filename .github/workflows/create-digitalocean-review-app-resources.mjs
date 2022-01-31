#!/usr/bin/env zx

import { sleep } from "zx";

const projectName = process.env.REPO_NAME.split("/")[1];
const firewallName = `${projectName}-review-apps`;
const loadBalancerName = `${projectName}-review-apps`;
const certificateName = `${projectName}-review-apps`;
const dropletName = `pr-${process.env.PR_NUMBER}`;
const dropletReviewAppTag = "review-app";
const subDomainName = `review-apps.${process.env.DOMAIN_NAME}`;
const digitaloceanBaseUrl = "https://api.digitalocean.com/v2";
const headers = { Authorization: `Bearer ${process.env.DIGITALOCEAN_ACCESS_TOKEN}` };

validateSecrets();
const { dropletPort } = await getOrCreateDroplet();
const loadBalancer = await createOrGetLoadBalancer();
const reviewAppInboundRule = { protocol: "tcp", ports: dropletPort, sources: { load_balancer_uids: [loadBalancer.id] } };
await createDomainIfDoesntExist(loadBalancer);
const certificateId = await getOrCreateCertificate();
await createDropletLoadBalancerForwardingRuleIfDoesntExist(loadBalancer, certificateId);
const firewall = await getOrCreateFirewall(loadBalancer);
await createFirewallRuleIfDoesntExist(firewall);

export async function getLoadBalancer(tryUntilReady = false) {
  const loadBalancerResponse = await fetch(`${digitaloceanBaseUrl}/load_balancers`, { headers });
  await checkResponseValidity(loadBalancerResponse, "Could not fetch load balancer list:");

  const { load_balancers } = JSON.parse(await loadBalancerResponse.text());
  const loadBalancer = load_balancers.find(loadBalancer => loadBalancer.name === loadBalancerName);
  if (!loadBalancer?.ip && tryUntilReady) {
    console.log("Waiting 10 seconds for load balancer to be available");
    await sleep(10000);

    return await getLoadBalancer(tryUntilReady);
  }

  return loadBalancer ? loadBalancer : null;
}

async function createOrGetLoadBalancer() {
  let loadBalancer = await getLoadBalancer();
  if (!loadBalancer) {
    const response = await fetch(`${digitaloceanBaseUrl}/load_balancers`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: loadBalancerName,
        tag: "review-app",
        region: "nyc1",
        health_check: {
          protocol: "http",
          port: 80,
          path: "/",
          check_interval_seconds: 10,
          response_timeout_seconds: 5,
          unhealthy_threshold: 5,
          healthy_threshold: 2
        },
        forwarding_rules: [{
          entry_protocol: "http",
          entry_port: 80,
          target_protocol: "http",
          target_port: 80
        }]
      })
    });
    await checkResponseValidity(response, "Could not create load balancer:");

    console.log("Sleeping 30 seconds to ensure load balancer has an IP assigned");
    await sleep(30000);
    loadBalancer = await getLoadBalancer(true);
  }
  return loadBalancer;
}

async function createDomainIfDoesntExist(loadBalancer) {
  const domainResponse = await fetch(`${digitaloceanBaseUrl}/domains/${process.env.DOMAIN_NAME}`, { headers });
  if (domainResponse.status === 404) {
    await $`doctl compute domain create ${process.env.DOMAIN_NAME}`;
    await $`doctl compute domain records create ${process.env.DOMAIN_NAME} --record-type A --record-name review-apps --record-data ${loadBalancer.ip}`;
  }
}

async function getCertificateId(tryUntilReady = false) {
  const loadBalancerOutput = await $`doctl compute certificate list --format "ID, Name"`.pipe(nothrow($`grep ${certificateName}`));
  if (!loadBalancerOutput.stdout && tryUntilReady) {
    console.log("Waiting 1 minute for certificate to be ready");
    await sleep(60 * 1000);

    return await getCertificateId(tryUntilReady);
  }

  return !loadBalancerOutput.stdout ? null : loadBalancerOutput.stdout.split(" ")[0];
}

async function getOrCreateCertificate() {
  let certificateId = await getCertificateId();
  if (!certificateId) {
    await $`doctl compute certificate create --type lets_encrypt --name ${certificateName} --dns-names ${subDomainName}`;
    certificateId = await getCertificateId(true);
  }
  return certificateId;
}

async function createDropletLoadBalancerForwardingRuleIfDoesntExist(loadBalancer, certificateId) {
  const hasExistingForwardingRule = (await $`doctl compute load-balancer list`.pipe(nothrow($`grep port:${dropletPort}`))).stdout;
  if (!hasExistingForwardingRule) {
    await $`doctl compute load-balancer add-forwarding-rules ${loadBalancer.id} --forwarding-rules entry_protocol:https,entry_port:${dropletPort},target_protocol:http,target_port:${dropletPort},certificate_id:${certificateId},tls_passthrough:false`;
  }
}

async function getFirewallId() {
  const firewallOutput = await $`doctl compute firewall list --format "ID, Name"`.pipe(nothrow($`grep ${firewallName}`));
  return !firewallOutput.stdout ? null : firewallOutput.stdout.split(" ")[0];
}

async function getOrCreateFirewall(loadBalancer) {
  let firewallId = await getFirewallId();
  if (!firewallId) {
    const response = await fetch(`${digitaloceanBaseUrl}/firewalls`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: firewallName,
        tags: [dropletReviewAppTag],
        inbound_rules: [
          { protocol: "tcp", ports: 22, sources: { addresses: ["0.0.0.0/0", "::/0"] } },
          { protocol: "tcp", ports: 80, sources: { load_balancer_uids: [loadBalancer.id] } },
          reviewAppInboundRule
        ],
        outbound_rules: [
          { protocol: "tcp", ports: 0, destinations: { addresses: ["0.0.0.0/0", "::/0"] } },
          { protocol: "udp", ports: 0, destinations: { addresses: ["0.0.0.0/0", "::/0"] } },
          { protocol: "icmp", ports: 0, destinations: { addresses: ["0.0.0.0/0", "::/0"] } }
        ]
      })
    });
    await checkResponseValidity(response, "Could not create firewall:");
    firewallId = await getFirewallId();
  }

  return await getFirewall(firewallId);
}

async function getFirewall(firewallId) {
  const firewallResponse = await fetch(`${digitaloceanBaseUrl}/firewalls/${firewallId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.DIGITALOCEAN_ACCESS_TOKEN}`
    }
  });
  await checkResponseValidity(firewallResponse, "Could not fetch firewall:");

  return JSON.parse(await firewallResponse.text()).firewall;
}

async function createFirewallRuleIfDoesntExist(firewall) {
  const hasExistingFirewallRule = firewall.inbound_rules.find(rule => rule.ports === dropletPort);
  if (!hasExistingFirewallRule) {
    const response = await fetch(`${digitaloceanBaseUrl}/firewalls/${firewall.id}/rules`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.DIGITALOCEAN_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        inbound_rules: [reviewAppInboundRule]
      })
    });
    await checkResponseValidity(response, "Could not create firewall rule:");
  }
}

async function checkResponseValidity(response, message) {
  if (!response.ok) {
    console.error(message);
    console.error(await response.text());
    process.exit(1);
  }
}

async function getDropletHost() {
  try {
    const { stdout: dropletIp } = await $`doctl compute droplet get ${dropletName} --format "Public IPv4"`.pipe(nothrow($`grep -v Public`));
    return dropletIp.replace("\n", "");
  } catch (error) {
    const hasLegitError = error.stderr && !error.stderr.includes("could not be found");
    if (hasLegitError) {
      console.error(error);
      process.exit(error.exitCode);
    } else {
      return null;
    }
  }
}

async function getFreeDropletPort(hasExistingDroplet) {
  if (hasExistingDroplet) {
    const dropletInfo = (await $`doctl compute droplet get ${dropletName}`).toString();
    return /port_\d+/m.exec(dropletInfo)[0].split("_")[1];
  }

  const port = parseInt(Math.random() * (65534 - 1024) + 1024);
  const hasExistingPort = (await $`doctl compute droplet list`.pipe(nothrow($`grep port_${port}`))).stdout;
  if (hasExistingPort) {
    return await getFreeDropletPort();
  }

  return port;
}

async function getOrCreateDroplet() {
  let dropletHost = await getDropletHost();
  const dropletPort = await getFreeDropletPort(!!dropletHost);
  await $`echo "DROPLET_PORT=${dropletPort}" >> $GITHUB_ENV`;
  if (!dropletHost) {
    await $`doctl compute droplet create ${dropletName} --image docker-20-04 --size s-1vcpu-1gb --region nyc1 --ssh-keys 32900988 --tag-names review-app,port_${dropletPort} --enable-private-networking --wait`;
    console.log("Waiting 10 seconds to ensure the droplet is really ready because of this bug: https://github.com/digitalocean/doctl/issues/1003");
    await sleep(10000);
    dropletHost = await getDropletHost();
  }

  await $`echo "DROPLET_HOST=${dropletHost}" >> $GITHUB_ENV`;
  await $`echo "DROPLET_URL=https://${subDomainName}:${dropletPort}" >> $GITHUB_ENV`;

  return { dropletHost, dropletPort };
}

function validateSecrets() {
  if (!process.env.DOMAIN_NAME) {
    console.error("You need to add your domain name as a secret with the following key 'DOMAIN_NAME'");
    process.exit(1);
  }

  if (!process.env.DIGITALOCEAN_ACCESS_TOKEN) {
    console.error("You need to add your DigitalOcean access token as a secret with the following key 'DIGITALOCEAN_ACCESS_TOKEN'");
    process.exit(1);
  }
}
