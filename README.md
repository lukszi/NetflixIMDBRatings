# NetflixIMDBRatings Userscript

## What is your problem?
Ever since Netflix removed ratings from their site, I get recommended movies 
only to halfway in realize they are absolute c-tier trash which a quick lookup on IMDB could've told me before.

But since I was to lazy to open another site and enter this movies title I just wasted 30 minutes of my evening and life,
and now it is too late to start another movie because I have to get up early in the morning,
which now leaves me with one hour that I don't know what to do with, since if I do something productive now 
I won't be able to go to sleep anymore and generally life is pain, holy shit I hate Netflix and why is it sunday evening again already.

All other userscripts and browser extensions I found are broken, here is my go at it.

## How do you wanna solve it?
Show IMDB ratings on the netflix cards

## What is this and how do I use it?
This is a userscript, you can use it by
1. Cloning this repository
1. using npm to build the userscript
1. Installing the Greasemonkey plugin in your browser
1. Adding this userscript to Greasemonkey
1. Giving this plugin the required permissions

## This doesn't work anymore
The source code is here, create a PR, fix it and ask me to merge it.

## Todo list
 * [x] Read movie titles from Netflix
 * [x] Get ratings from IMDB
 * [x] Insert ratings into the website using the classes and structures used by the Netflix "ratings"
 * [x] Update titles that were dynamically added by scrolling down
