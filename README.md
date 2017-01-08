# homebridge-rpitemp

Supports https devices on HomeBridge Platform

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g homebridge-rpitemp
3. Update your configuration file. See sample-config.json in this repository for a sample. 

# Configuration


Configuration sample file:

 ```
"accessories": [
        {
            "accessory": "homebridge-rpitemp.RpiTemp",
            "name": "RPi CPU Temp",
            "tempid": "cpu"
        }
    ]

```

