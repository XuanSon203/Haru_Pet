const express = require("express");
require("dotenv").config();
const app = express();
const systemConfig = require("./config/system");
const port = process.env.PORT || 3000;
const routerAdmin = require("./routes/admin/index");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const connectDb = require("./config/connectData");
const router = require("./routes/client/index");
connectDb.connect();
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.set("views", "views");
app.set("view engine", "pug");
// Cấu hình `cookie-parser`
app.use(cookieParser());

app.use(
  session({
    secret: "DSSHSHDHDH",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

// Sử dụng flash cho thông báo tạm thời
app.use(flash());

app.use(express.urlencoded());
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static("public"));

routerAdmin(app);
router(app);

app.listen(port, () => {
  console.log(`Server running port ${port}`);
});
