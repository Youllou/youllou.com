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
Lets read the challenge for real... so there is a file located at '/opt/share/logs/ghostnet.log'

Alright lets try to simply reach this webpage `https://172.16.10.10/opt/share/logs/ghostnet.log`
<br>
<br>
Doing this redirects us to a web manager login page.

After some reading about the exact device the [AXC F 2152](https://product-download.phoenixcontact.com/10717664?response-content-disposition=inline;%20filename%3D%22um_en_axc_f_x152_observe_hw_version_107708_en_14.pdf%22&Expires=1761173026&Signature=zGV97gDL7i-De2CPD4dA~eeOvHJnfkiipPc93DIifBIzP~z0iB-rZFVMvFRaUpMJgJ4szKn3yedlGRVVd9x08PoyrvVsv8Xx90h3awjwEVOfmcXfCSxnpTwWLlA~wlWcvlPayGEeUCtOssuE9na9Cp1TyirXTemXEeNz9PKHEZNQaQUianHB4~~ZQlPqCAbkYCl-c2bDfGmPO6pT75eEyjyn2100eVsw7sRl6ZPik0Y10Isuz3RYX90vQBQMceJPmawoWTGjgTWPNAfeW05VbslL5mNBT6te2mW~wkXJ7BbV9L0JkdTLhWhSl0Msl5aGdio4Tqod-d5KD6OzQ1Elyg__&Key-Pair-Id=K1I2N54A7B0GD), I see that the password for the Web Based Manager (wbm) is the same as the one for ssh.

Wait... ssh ?
```sh
󰣇 ~ ❯ ssh 172.16.10.10                                                                                                     15:48
youllou@172.16.10.10's password:

```
OMG !

Well now whats the user name and the password

\*reading intensify\*

wait did read default password ![2152_defaultpasswd](/writeups/hackfest_2025/2152_defaultpasswd.png)
aa