# Northcoders House of Games API

Welcome to my NC-games repo!

This project designs a back end express server for a games review page where users can interact and comment on all kinds of reviews!

I've built in a bit of functionality, including options to filter by categories and sort by options.

You can check the hosted version here:
https://faisals-nc-games.onrender.com/api


If you'd like to test dd on or sample my code yourself, feel free to fork and clone down your own copy of the repo.

To install all required dependencies please run 'npm install' so you can download the following packages:
-dotenv for our env variables
-express to run the server
-pg for our connection
-jest, jest-sorted and supertest for running our test suite
--> we also have husky installed to prevent broken code from reaching main :D

Next you'll need to create a .env.test & .env.development file and set your PGDATABASE variables to the corresponding databases
eg. for .env.test --> PGDATABASE=nc_games_test   

Lastly, npm run setup-dbs & npm run seed in your terminal to create your own databases to play with.

**This repo requires a minimum node v19.6.0 and postgres v8.7.3




