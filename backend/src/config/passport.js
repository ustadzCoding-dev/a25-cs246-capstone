import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

/**
 * Configure Passport Google OAuth Strategy
 */
const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        proxy: true, // Trust proxy for Railway/Render deployment
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Extract user data from Google profile
          const userData = {
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            profilePicture: profile.photos[0]?.value || null,
          };

          console.log("✅ Google OAuth Profile:", {
            id: profile.id,
            email: userData.email,
            name: userData.name,
          });

          // Pass user data to callback handler
          return done(null, userData);
        } catch (error) {
          console.error("❌ Google Strategy Error:", error);
          return done(error, null);
        }
      }
    )
  );

  // Serialize user (not needed for stateless JWT, but required by passport)
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Deserialize user
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

export default configurePassport;
