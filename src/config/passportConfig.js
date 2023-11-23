import passport from "passport";
import local from "passport-local";
import dotenv from "dotenv";
import GithubStrategy from "passport-github2";
import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/userRepository.js";
import { CartRepository } from "../repositories/cartRepository.js";

dotenv.config();
const LocalStrategy = local.Strategy;
const userRepository = new UserRepository();
const cartRepository = new CartRepository();

const initializePassort = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, age } = req.body;
          const userExists = await userRepository.get(username);

          if (userExists) {
            return done(null, false);
          }
          const cart = await cartRepository.create();

          const user = await userRepository.create({
            first_name,
            last_name,
            email: username,
            age,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
            cart: cart._id,
            role: "user",
          });
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = userRepository.getById(id);
    done(null, user);
  });

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userRepository.get(username);
          if (!user) {
            return done(null, false);
          }
          if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: process.env.PASSPORT_GITHUB_CLIENTID,
        clientSecret: process.env.PASSPORT_GITHUB_CLIENTSECRET,
        callbackURL: "http://localhost:8080/api/githubcallback",
        scope: ["user:email"],
      },
      async (accesTocken, refreshToken, profile, done) => {
        try {
          //console.log(profile, "profile");
          const email = profile.emails[0].value;
          const user = await userRepository.get(email);
          if (!user) {
            const newCart = await cartRepository.create();

            const newUser = await userRepository.create({
              first_name: profile._json.name,
              last_name: "",
              email,
              age: 32,
              password: "",
              cart: newCart._id,
              role: "user",
            });
            return done(null, newUser);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export default initializePassort;
