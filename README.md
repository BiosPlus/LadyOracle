# LadyOracle
*Discord bot made by BiosPlus with multiple functions.*

> Because this discord sucks and needs fixin'

BADGES LOL

[![GitHub issues](https://img.shields.io/github/issues/BiosPlus/LadyOracle?style=for-the-badge)](https://github.com/BiosPlus/LadyOracle/issues)
[![GitHub stars](https://img.shields.io/github/stars/BiosPlus/LadyOracle?style=for-the-badge)](https://github.com/BiosPlus/LadyOracle/stargazers)
[![CodeFactor](https://www.codefactor.io/repository/github/biosplus/ladyoracle/badge)](https://www.codefactor.io/repository/github/biosplus/ladyoracle)

# Appendages

## *Active*
Active appendages are those which are triggered with the `prefix`
	

    > AudioPlay		Scans message and follows the link supplied. If the link is an audio file, it will join the voice channel the sender is currently in and start playing.
	> HardMute (WIP)
	> HardUnmute (WIP)
	> Guildinfo			Prints non-invasive information about the current guild.


## *Passive*
Passive appendages are those which apply to every message received. These are generally monitoring tools.

    >Toxicity-Checker		Sends the message for analysis via PerspectiveAPI, returns score.


# Installation

## DOCKER (Doesn't work right now)

	docker create \
	--name=LadyOracle \
	-v /path/to/dir:/app \
	--restart unless-stopped \
	biosplus/ladyoracle
	