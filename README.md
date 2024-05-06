# GiveNGet

GiveNGet is a platform built by to address: too much waste, not enough resources, and financial struggles for many in our community. It's a virtual hub where people can share things they no longer need with others who could use them. Our goal with GiveNGet is to promote sustainability, strengthen community bonds, and reduce the negative impact of overconsumption on our planet.

### Purpose
The purpose of GiveNGet is to address two interconnected problems:

1. **Excessive Consumerism:** GiveNGet addresses the issue of excess belongings by helping people share what they no longer need. This reduces clutter, prolongs the life of items, and cuts down on waste.

2. **Financial Inequity:** GiveNGet tackles financial inequality by providing a platform where people can find essential items for free. This eases financial strain.

## Team

  - __Product Owner__: Ismael
  - __Scrum Master__: TDB
  - __Development Team Members__: Keyllne, nathaniel

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

### Clone the Repository

```
git clone <repository_url>
```

### Frontend Setup
```
cd frontend
npm i
npm run build
```

### Server Setup
```
cd ../server
npm i
```
Ensure that the PostgreSQL database named "ink" is created.

### Run database migrations:
```
npx knex migrate:latest
npx knex seed:run
```

### Start project in development
```
npm run dev -- in frontend
npm run dev -- in frontend
```



## Requirements

- Node 0.10.x
- Redis 2.6.x
- Postgresql 9.1.x
- etc
- etc

## Development

### Installing Dependencies

From within the root directory:

```sh
<COMMANDS_HERE>
```

### Roadmap

View the project roadmap [here](LINK_TO_PROJECTS_TAB).


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.


## Style Guide

This project adheres to the [Airbnb Style Guide](https://github.com/airbnb/javascript).