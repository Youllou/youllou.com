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

Let's see
![2152_picture](/writeups/hackfest_2025/2152_picture.jpg)
Ok I'm in, and with the ssh connection I can easily read the ghostnet.log file giving me the second flag !

and the whole network configuration ? Damn 
![ghostnet_log](/writeups/hackfest_2025/ghostnet.jpg)

## Break things
<div class="subtitle">
 > Alright, whats next ? Im so ready !

 \>(Spoiler: I was not)
</div>

The next step is "stop the train !"
<br>
<br>  

---
\
Ohhhh yeah mb, lets take a moment to give you the whooole context of the challenge.
The "intelligent system" is controlling some aspect of an intelligent city :
- There is, as talked before, a water container that fills up
- There is a train that goes regulary through some stops
- And there is some wind turbines (we'll see that in a bit)

---
\
<br>
My first thought was to modify the firewall in the web manager to block the train controller ip. But the connexion is already up, so blocking it won't do anything.
<div class="subtitle">
> actually the personn in charge of the challenge was surprised it didn't work
</div>

I tried some stuff like killing the process but I wasnt root (yet)

OK, ok... Lets take a step back.
Oh wait, there is a tool to control a PLC AXL controller called [PLCnext Engineer](https://www.phoenixcontact.com/en-ca/products/programming-plcnext-engineer-1046008)
Lets download it and see if we can connect to the device. 

(redflag: its only for windows).

OK so... lets setup the controller..., heres the ip, heres the model.

whats this stop button ? Oh well the train is stopped now !

GIMME FLAG 3 !

## Getting in the firewall 
<div class="subtitle">
> No no, I dont want to go through it, I want to be in it
</div>

There is Mguard firewall on the network, and the next flag is to get in it.

Oh shit this is one of the 500$ prize WTF ?

ok ok...

So me, i dont have access to the private network in 192.168
but there is a 172.16 ip for the mguard... which is completly locked...

but the controller which I have access to from the 172.16 network have access. Indeed if I try to ssh to 192.168.1.1 when im already ssh'd in 172.16.1.10 it ask me for a password.

After a bit of skill issue... 
<img src="https://media1.tenor.com/m/nqCT9DrRXt8AAAAd/smg4-smg4skill-issue.gif" style="width:10%;">
</img>

I managed to do a ssh tunnel

at some point i even modified the sshd config and broke the control so it would be reload on reboot.

Not gonna lie, i dont know if that helped XD

But ANYWAYS...

Now I have access to the login page of the webmanager of the MGuard\
\
Wait wait wait...
![default_mguard](/writeups/hackfest_2025/mguard_default.png)
Can not be modified ????<br>
<br>
<div class="subtitle">
> me : how much can i break stuff

\> the challenge designer : well you can break as much as you want... it'll just be a bit long to reset it all

\> me : so I can brut force ?

\> the challenge designer (with a side eye): maybe

\> me : like with rockyou and all ?

\> the challenge designer (even bigger side eye) : sure
</div>

Ok so lets bruteforce this MGuard
I made a lil python script to send some post requests to the login page with rockyou.txt
lets try with the root user name...
Damn thats long...
<div class="subtitle">
> the challenge designer : maybe you can try with the admin username

\> me : you sure that with rockyou it will work ?

\> the challenge designer : with \*cough\* ROCKYOU \*cough\* it should work
</div>


Ok so lets try with admin
I didnt even have the time to start talking that here it was

and the password was `rockyou`.............

Now i can simply add my ip as allowed in the firewall rules giving me access to this flag !!!!

Wait, I'm the first one ? So I win the 500$ prize ?! DAMN !!!!!!

Just after that I chated with the second person who got in the firewall, and he told me he was the one to win the 3000$ bounty last year... And I still managed to be first in the firewall... Damn I feel good

## Last step : Wind turbine takeover
The last step is to take control of the wind turbines.
