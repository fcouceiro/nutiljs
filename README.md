
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

Create a controller based on the [provided placeholder](https://github.com/fcouceiro/nutil/tree/master/placeholders/controllers):

    nutil --controller (-c) <controllerName>

  

Create a service based on [provided placeholder](https://github.com/fcouceiro/nutil/tree/master/placeholders/services):

    nutil --service (-s) <serviceName>

  

Create a model based on [provided placeholder](https://github.com/fcouceiro/nutil/tree/master/placeholders/models):

    nutil --model (-m) <modelName>

  

Create a resource based on [provided placeholder](https://github.com/fcouceiro/nutil/tree/master/placeholders/resources):

    nutil --resource (-r) <resourceName>

  

Create both a controller and a service:

    nutil -s <serviceName> -c <controllerName>

## Placeholders
Both controllers and services are generated based on placeholders provided by the user. 

Placeholders must be placed inside `placeholders/` folder. 

A few basic placeholders are included by default.
