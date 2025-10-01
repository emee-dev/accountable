export default {
  providers: [
    {
      domain: `${process.env.CONVEX_SITE_URL}`,
      applicationID: "convex",
    },
    // {
    //   domain: `http://localhost:3000`,
    //   applicationID: "betterAuth",
    // },
    {
      domain: `https://accountable-lemon.vercel.app`,
      applicationID: "Better Auth",
    },
  ],
};
