import passport from "passport";
import local from "passport-local";
import GithubStrategy from "passport-github2";
import bcrypt from "bcrypt";
import { userModel } from "../dao/models/user.model.js";
import { cartModel } from "../dao/models/cart.model.js";

const LocalStrategy = local.Strategy;
const initializePassort = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, age } = req.body;
          const userExists = await userModel.findOne({ username });

          if (userExists) {
            return done(null, false);
          }
          const cart = await cartModel.create({});

          const user = await userModel.create({
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
    const user = userModel.findById(id);
    done(null, user);
  });

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username }).lean();
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
        clientID: "Iv1.b72a2fc9d97517ae",
        clientSecret: "f4279a1300bad3226354789a9af1fd8d0f5ec341",
        callbackURL: "http://localhost:8080/api/githubcallback",
        scope: ["user:email"],
      },
      async (accesTocken, refreshToken, profile, done) => {
        try {
          console.log(profile, "profile");
          const email = profile.emails[0].value;
          const user = await userModel.findOne({ email });
          console.log(user, "user");
          if (!user) {
            const newCart = await cartModel.create({});

            const newUser = await userModel.create({
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
