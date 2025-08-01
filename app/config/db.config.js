module.exports = {
  HOST: "ep-lucky-cell-afu1wv6g-pooler.c-2.us-west-2.aws.neon.tech",
  USER: "neondb_owner",
  PASSWORD: "npg_F7fre4tcTZnV",
  DB: "neondb",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false 
      }
    },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};