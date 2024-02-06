# Hear Technical Interview

## 🏎️ Getting started

1. Login to Stackblitz with your Github account.
2. Fork this project via the "Fork" button at the top of this page.
3. Share your solution's url with your recruiter at least one day before your technical interview.
4. Have fun with this exercise, try not to stress too much. We don't expect you to complete all the acceptance criteria before the technical invterview, but it's ok if you do.

## 🥅 Goals

You are tasked with creating an api to track the meals a user eats each day. You will need to design it in a way that makes it easy to manage these entries.

### Things that you shouldn't spend time on

- AuthN (assume in a live system this would be handled)
- Database management (an in memory store is fine)

### Acceptance Criteria

As a user,
I should be able to...

1. Log my meal entry
2. View all public meal entries
3. View all my meal entries
4. Update my meal entries - I should only be able to modify a meal in the first minute after the meal was created. After that, it is read only.

IMPORTANT: Please note places that your code is lacking and that you would improve before releasing to a live system. These will be discussed further during your interview.

## 🤓 Development

We've set up a little boilerplate to allow for automatic server restarts as you work through your implementation.

```shell
npm start
```

## Frequently Asked Questions

### 🖐️ What if I get stuck?

Like any project you are going to run into, there will be things that you don't understand or have questions about. Write them down so we can make sure to cover them while we pair up during the technical interview.

### ❓ Can I add "X" dependency?

Absolutely. This is merely a canvas to showcase your current experience with Typescript/Node and your ability to design modern systems.

### 🤔 I am unfamiliar with the Koa, can I use some other server framework?

Yes of course, we don't expect you to know everything about our exact tech stack. We do ask that you choose a minimalist framework to keep things simple. E.g. Express, Hapi, or Fastify.

### ⏰ How much time are you expecting me to devote to this?

At Hear we highly value a work/life balance. We completely understand that you have life obligations that may limit the time you can put into this exercise. We've had candidates live code the entire thing during the technical interview as well as having a complete solution ready from the get go. We're flexible and welcome whatever contributions you have time for. And the truth is all of us have varying degrees of experience and to suggest an expected time range on this would only undermine the intentions of the exercise.

# Comments

Thank you for providing a home task, it makes us feel less nervous and able to show a bit more expertise in the development area! 😊

Unfortunately, I'm new to Koa, so I've used a skeleton to have more speed of development. I've spent some time taking a look and it seems pretty straight forward to use, but it will require a little bit of time to update the code.

I've used MongoDB as a database, there are no IP restrictions to connect to for test purposes.

The approach used was to document first, creating the Swagger Doc, and then, with `openapi-typescript-codegen` all models are generated based on the Swagger Doc.

When the service is running, the root address provides the Swagger UI and it's possible to interact with the service through it.

For tests, the bearer token provided is the username.

## Doubts

- Does it need to be multi-language?
- Does it need a delete meal endpoint?
- Is CORS necessary on the backend side?
- Is it an issue to allow multiple updates or should we add an ETAG to handle concurrency to update a meal entry?

## Improvements

- Some small improvements are listed in the TODO comments throughout the code
- Clear the package.json
- Add middleware for authorization and authentication
- Use KoaJS, keeping the SwaggerDoc
