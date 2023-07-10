# Setup

### Requirements
- Docker

### Technologies Used:

Node.js: The API was developed using Node.js with the Express framework.

Caching: A cache layer is implemented using Redis, utilizing the ioredis library.

Testing: The project includes tests implemented with Jest.

### Structure

The project is structured as follows:
  - root
    - routes
    - modules
        - module_name
            - routes
            - actions
            - helpers
    - utils
        - redis.js
        - cache.js
        ...


### Setup .env

To configure the application properly, you need to create two environment files: ".env" and ".env.local". The ".env" file should be used with Docker Compose, while the ".env.local" file is meant for running the application locally.

Make sure to create these files in the root directory of the project and populate them with the following variables:

- PRICE_UPDATE_FREQUENCY_IN_SECONDS={seconds}
- SERVICE_COMMISSION={percentage}
- PORT={port}

Assign appropriate values to these variables in their respective files to ensure the application runs correctly.

### Start the containers

The following command will initiate the startup process for all containers within the same network:
The included containers are:

-  Redis Server
-  API

```sh
docker-compose up
```

To run the Node.js app locally with the Redis container, use the following commands:

```sh
# Start Redis container without the Node.js app
docker-compose -f docker-compose.local.yml up
```

```sh
# Load the correct env file (env.local) and start the Node.js app locally
npm install && NODE_ENV=local npx ts-node src/api.ts
```

Also if you are using VScode you can debug the application by choosing the application `Debug API` and pressing F5.

# Endpoints
To access the documentation, you can use the API endpoint "/docs" which will load a Swagger documentation.

#### Local
http://localhost:3001/docs

##### Get bitcoin price
```sh
curl --request GET \
  --url http://localhost:3001/prices/bitcoin
``` 


#### Server
http://ec2-34-238-119-22.compute-1.amazonaws.com:3001/docs

##### Get bitcoin price
```sh
curl --request GET \
  --url http://ec2-34-238-119-22.compute-1.amazonaws.com:3001/prices/bitcoin
``` 

# How it works?
The API sends requests to the Binance API to fetch the bid price and ask price. 
The mid price is calculated as the average of the bid price and ask price.

To enhance performance, the API caches the mid price for a specified duration, which can be customized through the environment variables.

Sample Response:
```json
{
	"symbol": "BTC",
	"bidPrice": "30279.59765700",
	"bidQty": "8.16253000",
	"askPrice": "30279.60765800",
	"askQty": "16.65794000",
	"midPrice": "30279.60265750",
	"lastUpdate": "2023-07-10T18:10:43.651Z"
}
```


# Tests

Run unit tests
```sh
docker exec -it bitcoinapi npm test
```