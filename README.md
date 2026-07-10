

![Logo for Schroedinger's Chat](./frontend/public/LogoTransparent.png)

## Install Instructions:
On Linux:
```bash
apt-get update && apt-get upgrade -y && apt-get install -y curl
curl -fsSL https://gitlab.com/final-project5855325/schroedingers_chat/-/raw/dev/install.sh?ref_type=heads | bash
```

##### Prerequisite:
* at least 8GB RAM
* at least 4 CPU Cores
* working network configuration with URL forwarding ports 80 and 443 to target

needed to enter into install Script:
* domain
* JWT Secret (at least 256bits)
* DB password
* Super Admin password
* MinIo Password
* Encryption Master Key (at least 256bits)
