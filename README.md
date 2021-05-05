<p align="center" style="background-color: #000000;">
  <a href="https://devxsolution.com/" target="blank" ><img src="https://scontent.fjdo1-1.fna.fbcdn.net/v/t1.6435-9/180900085_300471624999950_573693597891277187_n.png?_nc_cat=104&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=fxCbLZRnssMAX9H6nRH&_nc_ht=scontent.fjdo1-1.fna&oh=7eb2764d7d5e0904b9b62dde2fed008e&oe=60B897DB" width="320" alt="Dxs Logo" /></a>
</p>

## Description

This a test example to join DevxSolution awesome team.

## Installation

```bash
$ npm install
```

Create a schema named **ecommerce** on your Postgresql database.

## Running the app

Create a .env file on the root directory of this project with the following content:

```bash
DATABASE_URL=postgresql://admin:admin@localhost:5432/dexstest?schema=ecommerce
EMAIL=noreplydevxs@gmail.com
EMAIL_PASSWORD=
EMAIL_VERIFY_SUBJECT=Devx E-Commerce - E-mail Validation
URL_EMAIL_VERIFY=http://localhost:3000/auth/checked
EMAIL_FROM='"Devxs Test" <devxs@devxs.com>'
EMAIL_HOST='smtp.gmail.com'
EMAIL_PORT=587
JWT_SECRET=yYl8%BIm6MEZsHaW#iO2nCQamhUAYWlh213
JWT_EXPIRES_IN=3600s
APPLICATION_COOKIE_NAME=DEXs
APPLICATION_SECRET=yYl8%BIm6MEZsHaW#iO2nCQamhUAYWlh213
ENCRYPT_KEY=D3VXSOLUTIONS#321654
STATIC_FOLDER=public
```

You have to change the url for database and also specify an email account that the system can use in order to use authentication emails. (I´ve already created this fake email to make it easier, but feel free to change it)

To create our database system, run:

```bash
npx prisma
npx prisma db push --preview-feature
```

Then you can run one of these commands:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

There is one admin user already created by default:
test@gmail.com/test#123
With this user you can create another admin accounts.
For guest users, just use the current sign up flow.

## Stay in touch

- Author - [Thiago Santana Batista](https://github.com/ThiagoSanBat/)
