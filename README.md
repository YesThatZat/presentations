# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## What is this?

This is an attempt at a sveltekit configuration that satisfies particular enterprise deployment requirements. Its not finished, you shouldn't base yourself on this.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.


## Containerisation

### Platform
Install either Podman or Docker

Then install the respective CLI tool

```bash
# podman cli - Powershell
winget install -e --id RedHat.Podman
# You may need to reboot the machine before podman cli shows up
```

### Building the container

```bash
# Local build to use without kubernetes
podman build ./ -t sveltekit-app:local .

# Local build to use with kubernetes
podman build -t localhost:5000/sveltekit-app:local .
# Push the image (tls verification disabled because this is local and happens over http)
podman push localhost:5000/sveltekit-app:local --tls-verify=false
```

### Building the container for local kubernetes

There is a local overlay for kubernetes that you can use by building the container above.

You will need to have kubectl installed and configure the context.

```bash
# Example creating a kind cluster
kind create cluster --name dev

# Check the configuration
kubectl config current-context

# Should return
kind-dev

# If you don't have an ingress controller set up, then install one.
kubectl apply -f https://kind.sigs.k8s.io/examples/ingress/deploy-ingress-nginx.yaml

# Start a local registry to push the built images to.

podman run -d `
  --name kind-registry `
  --restart=always `
  -p 5000:5000 `
  docker.io/library/registry:2

# Check the registry is present
curl.exe -v http://127.0.0.1:5000/v2/

# Connect the registry and the Kind cluster

## find its container name
podman ps --format "{{.Names}}\t{{.Ports}}" | findstr 5000

## wire it up (using an alias otherwise it just becomes randomchars in the hosts)
podman network connect --alias kind-registry kind kind-registry

## Prove kind can reach it
podman exec -it dev-control-plane sh -c "getent hosts my-local-registry || getent hosts kind-registry || echo DNS_FAILED"

## if it can't try reconnecting the registry, sometimes it will show as connected but trying to connect it again refreshes the dns or something.
### Full example:
PS D:\Projects\SveltekitStorybookVitestSonarDocker> podman exec -it dev-control-plane sh -c "getent hosts kind-registry || echo DNS_FAILED"
DNS_FAILED
PS D:\Projects\SveltekitStorybookVitestSonarDocker> podman ps --format "table {{.Names}}\t{{.Ports}}\t{{.Status}}" | findstr 5000
kind-registry      0.0.0.0:5000->5000/tcp     Up 35 minutes
PS D:\Projects\SveltekitStorybookVitestSonarDocker> podman network connect kind kind-registry
Error: container 1fcc4c7653b652bb231aea4e9b39f7ceed7c13333eb2223d9f0b6bfb89d2fcc7 is already connected to network kind: network is already connected
PS D:\Projects\SveltekitStorybookVitestSonarDocker> podman exec -it dev-control-plane sh -c "getent hosts my-local-registry || getent hosts kind-registry || echo DNS_FAILED"
fc00:f853:ccd:e793::4 my-local-registry.dns.podman
PS D:\Projects\SveltekitStorybookVitestSonarDocker> 

## Configure the registry to accept connections from within kind
podman exec -it dev-control-plane sh -c "mkdir -p /etc/containerd/certs.d/kind-registry:5000"
podman exec -it dev-control-plane sh -c "cat > /etc/containerd/certs.d/kind-registry:5000/hosts.toml <<'EOF'
server = 'http://kind-registry:5000'

[host.'http://kind-registry:5000']
  capabilities = ['pull', 'resolve', 'push']
  skip_verify = true
EOF"

## restart containerd
podman exec -it dev-control-plane sh -c "systemctl restart containerd 2>/dev/null || service containerd restart 2>/dev/null || pkill -HUP containerd || true"

## Prove it can pull
podman exec -it dev-control-plane sh -c "ctr -n k8s.io images pull --plain-http kind-registry:5000/sveltekit-app:local"

```

# Wire up the port forwarding of the ingress controller to the sveltekit app
kubectl -n ingress-nginx port-forward svc/ingress-nginx-controller 8080:80
```

To apply the local kubernetes overlay
```bash
kubectl apply -k manifests/overlays/local
```
