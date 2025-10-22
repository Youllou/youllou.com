---
meta: article
title: "Operation Shutdown (Phoenix Contact)"
---
# Operation Shutdown (Phoenix Contact)
<div class="subtitle">
    > How much I knew nothing about IOT
</div>

## Preface
So... last year at Hackfest there was this incredible, un-obtainable, un-reachable challenge.

Some company named Phoenix Contact came and created a bug bounty worth 3,000 CAD for finding vulnerabilities in their IOT SCADA/OT platform.

I was like 

*"Cool, but I have no idea what IOT/SCADA/OT stuff, and if it's worth 3000$, that is way above my level"*
<br>
<br>
Just after that I went to the SCADA Village and took a class on IOT. I learned about MQTT, HiveMQ, Mosquitto, and a lot of other stuff.
This gave me so much confidence that I could try the challenge next year.

When I saw that Phoenix Contact was back again this year, I ran for it and said to my teammates *"Guys, this is my challenge, Let me cook that"*.

(Spoiler: I learned a lot, then I cooked)

## Easy start
The first part of the challenge really was a childlike intro, you had to click on the screen they had to "overfill the water container"

You simply had to click on two buttons at the same time and the container on the screen would fill to a "critical level" giving us the first flag but also the ip address of the device.

## Reconnaissance
So I had an IP address now, lets see if there is a web server on it.
- Yay there is !
- Wait, it's just the same interface shown on the screen...
<br>
<br>
Lets read the challenge for real... so there is a file located at '/opt/'