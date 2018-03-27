
# nutil - Node Utility

A command-line tool for generating controllers and services based on placeholders provided by the user

## Installation

This package will soon be published to the npm registry. 
Until then, run:
* `yarn install` or `npm install`
* `npm link`

inside the package dir. 

You will then be able to run `nutil` from the command line. 

## Usage

Create a controller based on the provided placeholder:

    nutil --controller (-c) <controllerName>

  

Create a service based on provided placeholders:

    nutil --service (-s) <serviceName>

  

Create a model based on provided placeholders:

    nutil --model (-m) <modelName>

  

Create both a controller and a service:

    nutil -s <serviceName> -c <controllerName>

## Placeholders
Both controllers and services are generated based on placeholders provided by the user. 

Placeholders must be placed inside `placeholders/` folder. 

A few basic placeholders are included by default.