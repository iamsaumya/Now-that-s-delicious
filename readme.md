<h1 align="center">Now that's delicious</h1>
<p align="center">
  <i>An open, extensible, platform for business owners and their customers.<br/>Try out Now that's delicious hosted version at <a href="https://now-that-s-delicious.herokuapp.com/">www.now-that-s-delicious.herokuapp.com</a>.</i>
  <br/>
  <img width="1640" alt="screenshot" src="https://user-images.githubusercontent.com/40148448/112752256-b74a7d00-8fef-11eb-8812-2d9a1aa3a4ee.png">
</p>
<p align="center">
  <img src="https://img.shields.io/github/issues/iamsaumya/Now-that-s-delicious">
  <img src="https://img.shields.io/github/forks/iamsaumya/Now-that-s-delicious">
  <img src="https://img.shields.io/github/stars/iamsaumya/Now-that-s-delicious">
</p>

# Installation

Outline requires the following dependencies:

- [Node.js](https://nodejs.org/)
- [Npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/)
- Google developer MAP key
- Nodemailer Keys

## Local Development

For contributing features and fixes you can quickly get an environment running using Docker by following these steps:

1. Install these dependencies if you don't already have them
  1. [Node.js](https://nodejs.org/) (v12 LTS preferred)
  1. [Npm](https://www.npmjs.com/)
  1. [MongoDB](https://www.mongodb.com/)
1. Clone this repo
1. Register an app at Google Cloud console and [get an api key](https://developers.google.com/maps/documentation/embed/get-api-key)
1. Copy the file `.env.sample` to `.env`
1. Fill out the following fields:
    1. `SECRET_KEY` (follow instructions in the comments at the top of `.env`)
    1. `KEY` (this is the key used to access data from Mongodb store)
    1. `MAP_KEY` (Google Maps API key)
1. Run `npm install`, this wil download dependencies.
1. Run `npm run dev` to run the server in development mode.


# Contributing

Now that's delicious was built to learn Nodejs. I am not accepting any contributions, feel free to fork this repository and use this however you want.
