const express = require("express");
const app = express();
const cors = require("cors");
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const dotenv = require("dotenv").config();
const URL = process.env.db;
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const EMAIL = process.env.email;
const PASSWORD = process.env.password;

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

app.post("/user/register", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    req.body.password = hash;
    delete req.body.confirmpassword;
    const userFinding = await db
      .collection("users")
      .findOne({ email: req.body.email });

    const adminFinding = await db
      .collection("admins")
      .findOne({ email: req.body.email });
    if (userFinding) {
      res.json({ message: "Email-id already registered, use another" });
    } else if (adminFinding) {
      res.json({ message: "Admin account finded in this email_id" });
    } else {
      const user = await db.collection("users").insertOne(req.body);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: EMAIL,
          pass: PASSWORD,
        },
      });
      const mailOptions = {
        from: EMAIL,
        to: req.body.email,
        subject: "Account Activated",
        html: `<h3>🙋‍♂️Hi <b>${req.body.name}</b>, your User-Account created successfully✨  </h3>
         `,
      };
      transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
          return;
        }
      });
      transporter.close();

      res.json({ message: "User Account created successfully" });
    }

    await connection.close();
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});
app.post("/admin/register", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");

    const salt = await bcrypt.genSalt(10);
    // $2b$10$5qVBhca30n201BEG7HPTpu
    const hash = await bcrypt.hash(req.body.password, salt);
    // $2b$10$5qVBhca30n201BEG7HPTpu66Jjeq1ONFAYa5/mE.IUc1aezLOsZmi

    req.body.password = hash;
    delete req.body.confirmpassword;
    const adminFinding = await db
      .collection("admins")
      .findOne({ email: req.body.email });

    const userFinding = await db
      .collection("users")
      .findOne({ email: req.body.email });
    if (adminFinding) {
      res.json({ message: "Email-id already registered, use another" });
    } else if (userFinding) {
      res.json({ message: "User account finded in this email_id" });
    } else {
      const user = await db.collection("admins").insertOne(req.body);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: EMAIL,
          pass: PASSWORD,
        },
      });
      const mailOptions = {
        from: EMAIL,
        to: req.body.email,
        subject: "Account Activated",
        html: `<h3>🙋‍♂️Hi <b>${req.body.name}</b>, your Admin-Account created successfully✨  </h3>
         `,
      };
      transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
          return;
        }
      });
      transporter.close();

      res.json({ message: "Admin Account created successfully" });
    }

    await connection.close();
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});
app.post("/user/register_confirm", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");

    const salt = await bcrypt.genSalt(10);
    // $2b$10$5qVBhca30n201BEG7HPTpu
    const hash = await bcrypt.hash(req.body.password, salt);
    // $2b$10$5qVBhca30n201BEG7HPTpu66Jjeq1ONFAYa5/mE.IUc1aezLOsZmi

    req.body.password = hash;
    delete req.body.confirmpassword;

    const user = await db.collection("users").insertOne(req.body);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: PASSWORD,
      },
    });
    const mailOptions = {
      from: EMAIL,
      to: req.body.email,
      subject: "Account Activated",
      html: `<h3>🙋‍♂️Hi <b>${req.body.name}</b>, your User-Account created successfully✨  </h3>
         `,
    };
    transporter.sendMail(mailOptions, function (error, response) {
      if (error) {
        return;
      }
    });
    transporter.close();

    res.json({ message: "User Account created successfully" });

    await connection.close();
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});
app.post("/admin/register_confirm", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");

    const salt = await bcrypt.genSalt(10);
    // $2b$10$5qVBhca30n201BEG7HPTpu
    const hash = await bcrypt.hash(req.body.password, salt);
    // $2b$10$5qVBhca30n201BEG7HPTpu66Jjeq1ONFAYa5/mE.IUc1aezLOsZmi

    req.body.password = hash;
    delete req.body.confirmpassword;

    const admin = await db.collection("admins").insertOne(req.body);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: PASSWORD,
      },
    });
    const mailOptions = {
      from: EMAIL,
      to: req.body.email,
      subject: "Account Activated",
      html: `<h3>🙋‍♂️Hi <b>${req.body.name}</b>, your Admin-Account created successfully✨  </h3>
         `,
    };
    transporter.sendMail(mailOptions, function (error, response) {
      if (error) {
        return;
      }
    });
    transporter.close();

    res.json({ message: "Admin Account created successfully" });

    await connection.close();
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");

    const user = await db
      .collection("users")
      .findOne({ email: req.body.email });

    const admin = await db
      .collection("admins")
      .findOne({ email: req.body.email });

    if (user && !admin) {
      const compare = await bcrypt.compare(req.body.password, user.password);

      if (compare) {
        res.json({ message: "User Login successfully", user_id: user._id });
      } else {
        res.json({ message: "email or password incorrect" });
      }
    } else if (admin && !user) {
      const compare = await bcrypt.compare(req.body.password, admin.password);

      if (compare) {
        res.json({ message: "Admin Login successfully", admin_id: admin._id });
      } else {
        res.json({ message: "email or password incorrect" });
      }
    } else if (admin && user) {
      const usercompare = await bcrypt.compare(
        req.body.password,
        user.password
      );
      const admincompare = await bcrypt.compare(
        req.body.password,
        admin.password
      );

      if (usercompare && !admincompare) {
        res.json({ message: "User Login successfully" });
      } else if (admincompare && !usercompare) {
        res.json({ message: "Admin Login successfully" });
      } else if (admincompare && usercompare) {
        res.json({
          message: "Finded user & admin account successfully",
          admin_id: admin._id,
          user_id: user._id,
        });
      } else {
        res.json({ message: "email or password incorrect" });
      }
    } else {
      res.json({ message: "email or password incorrect" });
    }
    await connection.close();
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
});
app.get("/admin/login_by/:_id", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");

    const find = await db
      .collection("admins")
      .findOne({ _id: mongodb.ObjectId(req.params._id) });
    res.json(find);

    await connection.close();
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});
app.get("/user/login_by/:_id", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");

    const find = await db
      .collection("users")
      .findOne({ _id: mongodb.ObjectId(req.params._id) });
    res.json(find);

    await connection.close();
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

app.post("/forgot", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");

    const user = await db
      .collection("users")
      .findOne({ email: req.body.email });

    const admin = await db
      .collection("admins")
      .findOne({ email: req.body.email });

    if (user && !admin) {
      var digits = "0123456789";
      let OTP = "";
      for (let i = 0; i < 5; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(OTP, salt);
      const store = await db
        .collection("users")
        .updateOne({ email: user.email }, { $set: { otp: hash } });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: EMAIL,
          pass: PASSWORD,
        },
      });
      const mailoptions = {
        form: EMAIL,
        to: req.body.email,
        subject: "User-Forgot Password",
        html: `<h1>🙋‍♂️Hi ${user.name}, Your OTP for create new password is ${OTP}. Use recently received OTP
          </h1>`,
      };
      transporter.sendMail(mailoptions, function (error, response) {
        if (error) {
          return;
        }
      });
      transporter.close();

      res.json({ message: "user_id finded", email: `${user.email}` });
    } else if (!user && admin) {
      var digits = "0123456789";
      let OTP = "";
      for (let i = 0; i < 5; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(OTP, salt);
      const store = await db
        .collection("admins")
        .updateOne({ email: admin.email }, { $set: { otp: hash } });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: EMAIL,
          pass: PASSWORD,
        },
      });
      const mailoptions = {
        form: EMAIL,
        to: req.body.email,
        subject: "Admin-Forgot Password",
        html: `<h1>🙋‍♂️Hi ${admin.name}, Your OTP for create new password is ${OTP}. Use recently received OTP
          </h1>`,
      };
      transporter.sendMail(mailoptions, function (error, response) {
        if (error) {
          return;
        }
      });
      transporter.close();

      res.json({ message: "admin_id finded", email: `${admin.email}` });
    } else if (user && admin) {
      res.json({
        message: "Finded User & Admin Account",
        admin_email: `${admin.email}`,
        user_email: `${user.email}`,
      });
    } else {
      res.json({ message: "Account not found in this email-Id" });
    }

    await connection.close();
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
});
app.get("/forgot/admin/:email_id", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");
    const admin = await db
      .collection("admins")
      .findOne({ email: req.params.email_id });
    if (admin) {
      var digits = "0123456789";
      let OTP = "";
      for (let i = 0; i < 5; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(OTP, salt);
      const store = await db
        .collection("admins")
        .updateOne({ email: req.params.email_id }, { $set: { otp: hash } });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: EMAIL,
          pass: PASSWORD,
        },
      });
      const mailoptions = {
        form: EMAIL,
        to: req.params.email_id,
        subject: "Admin-Forgot Password",
        html: `<h1>🙋‍♂️Hi ${admin.name}, Your OTP for create new password is ${OTP}. Use recently received OTP
          </h1>`,
      };
      transporter.sendMail(mailoptions, function (error, response) {
        if (error) {
          return;
        }
      });
      transporter.close();

      res.json({ message: "admin_id finded", email: `${req.params.email_id}` });
    }

    await connection.close();
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
});
app.get("/forgot/user/:email_id", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");
    const user = await db
      .collection("users")
      .findOne({ email: req.params.email_id });
    if (user) {
      var digits = "0123456789";
      let OTP = "";
      for (let i = 0; i < 5; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(OTP, salt);
      const store = await db
        .collection("users")
        .updateOne({ email: req.params.email_id }, { $set: { otp: hash } });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: EMAIL,
          pass: PASSWORD,
        },
      });
      const mailoptions = {
        form: EMAIL,
        to: req.params.email_id,
        subject: "User-Forgot Password",
        html: `<h1>🙋‍♂️Hi ${user.name}, Your OTP for create new password is ${OTP}. Use recently received OTP
          </h1>`,
      };
      transporter.sendMail(mailoptions, function (error, response) {
        if (error) {
          return;
        }
      });
      transporter.close();

      res.json({ message: "user_id finded", email: `${req.params.email_id}` });
    }

    await connection.close();
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
});

app.post("/forgot/admin/otp/:email_id", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");

    const admin = await db
      .collection("admins")
      .findOne({ email: req.params.email_id });
    if (admin) {
      const compare = await bcrypt.compare(req.body.otp, admin.otp);
      if (compare) {
        res.json({ message: "OTP correct" });
      } else {
        res.json({ message: "OTP incorrect" });
      }
    }

    await connection.close();
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
});
app.post("/forgot/user/otp/:email_id", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");

    const user = await db
      .collection("users")
      .findOne({ email: req.params.email_id });
    if (user) {
      const compare = await bcrypt.compare(req.body.otp, user.otp);
      if (compare) {
        res.json({ message: "OTP correct" });
      } else {
        res.json({ message: "OTP incorrect" });
      }
    }

    await connection.close();
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
});

app.post("/forgot/admin/otp/new_password/:email_id", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");
    delete req.body.newpassword;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.confirmpassword, salt);
    req.body.confirmpassword = hash;
    const admin = await db
      .collection("admins")
      .updateOne(
        { email: req.params.email_id },
        { $set: { password: req.body.confirmpassword } }
      );
    const admin2 = await db
      .collection("admins")
      .updateOne({ email: req.params.email_id }, { $set: { otp: "" } });
    res.json({ message: "Admin Password Created Successfully" });
    await connection.close();
  } catch (error) {
    res.status(400).json({ message: "something went jjwrong" });
  }
});

app.post("/forgot/user/otp/new_password/:email_id", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");
    delete req.body.newpassword;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.confirmpassword, salt);
    req.body.confirmpassword = hash;
    const user = await db
      .collection("users")
      .updateOne(
        { email: req.params.email_id },
        { $set: { password: req.body.confirmpassword } }
      );
    const user2 = await db
      .collection("users")
      .updateOne({ email: req.params.email_id }, { $set: { otp: "" } });
    res.json({ message: "User Password Created Successfully" });
    await connection.close();
  } catch (error) {
    res.status(400).json({ message: "something went jjwrong" });
  }
});

app.post("/change", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");

    const user = await db
      .collection("users")
      .findOne({ email: req.body.email });
    const admin = await db
      .collection("admins")
      .findOne({ email: req.body.email });
    if (user && !admin) {
      res.json({ message: "user_id finded", email: `${user.email}` });
    } else if (!user && admin) {
      res.json({ message: "admin_id finded", email: `${admin.email}` });
    } else if (user && admin) {
      res.json({
        message: "finded user & admin account",
        user_email: `${user.email}`,
        admin_email: `${admin.email}`,
      });
    } else {
      res.json({ message: "Account not found in this email-Id" });
    }

    await connection.close();
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
});
app.put("/change/user/:email_id", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");
    const emailFinding = await db
      .collection("users")
      .findOne({ email: req.params.email_id });

    if (emailFinding) {
      const compare = await bcrypt.compare(
        req.body.currentpassword,
        emailFinding.password
      );

      if (compare) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.confirmpassword, salt);
        req.body.confirmpassword = hash;
        delete req.body.newpassword;

        const user = await db
          .collection("users")
          .updateOne(
            { email: req.params.email_id },
            { $set: { password: req.body.confirmpassword } }
          );

        res.json({ message: "User Password Changed Successfully" });
      } else {
        res.json({ message: "Current Password Incorrect" });
      }
    } else {
      res.json({ message: "user_id undefined" });
    }

    await connection.close();
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
});
app.put("/change/admin/:email_id", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");

    const emailFinding = await db
      .collection("admins")
      .findOne({ email: req.params.email_id });

    if (emailFinding) {
      const compare = await bcrypt.compare(
        req.body.currentpassword,
        emailFinding.password
      );

      if (compare) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.confirmpassword, salt);
        req.body.confirmpassword = hash;
        delete req.body.newpassword;

        const admin = await db
          .collection("admins")
          .updateOne(
            { email: req.params.email_id },
            { $set: { password: req.body.confirmpassword } }
          );

        res.json({ message: "Admin Password Changed Successfully" });
      } else {
        res.json({ message: "Current Password Incorrect" });
      }
    } else {
      res.json({ message: "user_id undefined" });
    }

    await connection.close();
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
});

app.post("/admin/add_dishes", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");

    const finddishes = await db
      .collection("dishes")
      .findOne({ dish_name: req.body.dish_name });

    if (finddishes) {
      res.json({ message: "Dish name already there, use another" });
    } else {
      const add = await db.collection("dishes").insertOne(req.body);
      res.json({ message: "Dish added successfully" });
    }
    await connection.close();
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

app.put("/admin/edit_dishes/:_id", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");

    const finddishes = await db
      .collection("dishes")
      .findOne({ _id: mongodb.ObjectId(req.params._id) });

    delete req.body._id;

    if (finddishes) {
      const update = await db
        .collection("dishes")
        .updateOne(
          { _id: mongodb.ObjectId(req.params._id) },
          { $set: req.body }
        );

      res.json({ message: "Changes updated successfully" });
    } else res.json({ message: "Dish not found" });
    await connection.close();
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

app.delete("/admin/delete_dishes/:dish_name", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");

    const finddishes = await db
      .collection("dishes")
      .findOne({ dish_name: req.params.dish_name });

    if (finddishes) {
      const update = await db
        .collection("dishes")
        .deleteOne({ dish_name: req.params.dish_name });

      res.json({ message: "Dish deleted successfully" });
    } else res.json({ message: "Dish not found" });
    await connection.close();
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

app.get("/admin/view_dishes", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");

    const dishes = await db.collection("dishes").find().toArray();
    res.json(dishes);

    await connection.close();
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

app.get("/admin/view_dishes/:_id", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");

    const finddishes = await db
      .collection("dishes")
      .findOne({ _id: mongodb.ObjectId(req.params._id) });
    res.json(finddishes);

    await connection.close();
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

app.put("/user/addtocart/:id", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");

    const addingcart = await db
      .collection("users")
      .updateOne(
        { _id: mongodb.ObjectId(req.params.id) },
        { $push: { cart_list: mongodb.ObjectId(req.body.dish_id) } }
      );
    if (addingcart) {
      res.json({ message: "food added successfully" });
    } else {
      res.json({ message: "food added failed" });
    }

    await connection.close();
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});
app.get("/user/getcart_list/:id", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");

    const displayingcart = await db
      .collection("users")
      .aggregate([
        {
          $match: { _id: mongodb.ObjectId(req.params.id) },
        },

        {
          $lookup: {
            from: "dishes",
            localField: "cart_list",
            foreignField: "_id",
            as: "result",
          },
        },
        {
          $project: {
            result: "$result",
          },
        },
      ])
      .toArray();

    if (displayingcart) {
      res.json(displayingcart);
    } else {
      res.json({ message: "food added failed" });
    }
    await connection.close();
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

app.put("/user/removefromtocart/:id", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");

    const removingcart = await db
      .collection("users")
      .updateOne(
        { _id: mongodb.ObjectId(req.params.id) },
        { $pull: { cart_list: mongodb.ObjectId(req.body.dish_id) } }
      );
    if (removingcart) {
      res.json({ message: "food removed successfully" });
    } else {
      res.json({ message: "food removing failed" });
    }
    await connection.close();
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

app.delete("/user/delete_cart/:id", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");

    const find = await db
      .collection("users")
      .findOne({ _id: mongodb.ObjectId(req.params.id) });

    if (find) {
      const removingcart = await db
        .collection("users")
        .updateOne(
          { _id: mongodb.ObjectId(req.params.id) },
          { $unset: { cart_list: "" } }
        );

      res.json({ message: "cart deleted successfully" });
    }
    await connection.close();
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

app.post("/user/create_token", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");

    const finddate = await db
      .collection("tokens")
      .find({ date: req.body.date })
      .toArray();

    if (finddate) {
      let flen = finddate.length + 1;
      const length = flen + 100;

      req.body.token = `#ON!-${length}`;
    }

    for (let x of req.body.ordered_dishes) {
      const quantity = await db
        .collection("dishes")
        .findOne({ dish_name: x.dish_name });

      await db
        .collection("dishes")
        .findOneAndUpdate(
          { dish_name: x.dish_name },
          { $set: { quantity: quantity.quantity - x.qty } }
        );

      const status = await db
        .collection("dishes")
        .findOne({ dish_name: x.dish_name });

      if (status.quantity === 0) {
        await db
          .collection("dishes")
          .findOneAndUpdate(
            { dish_name: x.dish_name },
            { $set: { status: "not-available" } }
          );
      }
    }

    const m = req.body.ordered_dishes.findIndex((dish) => {
      return dish === null;
    });
    // console.log(req.body.ordered_dishes[m])
    //  req.body.ordered_dishes.splice(m,1)
    req.body.order_status = "droped";

    const insert = await db.collection("tokens").insertOne(req.body);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: PASSWORD,
      },
    });
    const mailOptions = {
      from: EMAIL,
      to: req.body.user_email,
      subject: "ON! kitchen",
      html: `<h3>🙋‍♂️Hi your order placed successfully✨, token no: <b>${req.body.token}</b> </h3></br>
    <h5>Amount you paid ${req.body.total_amount}</h5>
    <h6>further details , click ORDER tab in your site</h6>
  

   `,
    };
    transporter.sendMail(mailOptions, function (error, response) {
      if (error) {
        return;
      }
    });
    transporter.close();

    res.json({
      message: "order placed successfully",
      token: `${req.body.token}`,
    });

    await connection.close();
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
});

app.get("/user/view_order/:_id", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");

    const finddishes = await db
      .collection("tokens")
      .find({ user_id: req.params._id })
      .toArray();
    res.json(finddishes);

    await connection.close();
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

app.get("/admin/view_tokens", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");

    const tokens = await db.collection("tokens").find().toArray();
    res.json(tokens);

    await connection.close();
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

app.get("/admin/order_details/:_id", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");

    const find = await db
      .collection("tokens")
      .findOne({ _id: mongodb.ObjectId(req.params._id) });
    res.json(find);

    await connection.close();
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

app.put("/admin/order_status_picked/:_id", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");

    const find = await db
      .collection("tokens")
      .findOne({ _id: mongodb.ObjectId(req.params._id) });

    if (find) {
      const update = await db
        .collection("tokens")
        .updateOne(
          { _id: mongodb.ObjectId(req.params._id) },
          { $set: { order_status: "picked" } }
        );

      res.json({ message: "Order picked" });
    } else res.json({ message: "Dish not found" });
    await connection.close();
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});
app.put("/admin/order_status_delivered/:_id", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("food_token_generator_inhouse");

    const find = await db
      .collection("tokens")
      .findOne({ _id: mongodb.ObjectId(req.params._id) });

    if (find) {
      const update = await db
        .collection("tokens")
        .updateOne(
          { _id: mongodb.ObjectId(req.params._id) },
          { $set: { order_status: "delivered" } }
        );

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: EMAIL,
          pass: PASSWORD,
        },
      });
      const mailOptions = {
        from: EMAIL,
        to: req.body.user_email,
        subject: "ON! kitchen",
        html: `<h3>token no: <b>${req.body.token}</b></br>  🙋‍♂️Hi your order is ready for pickup✨</h3></br>
                  <h5>Amount you paid ${req.body.total_amount}</h5>
                  <h6>further details , click ORDER tab in your site</h6>
                
              
                 `,
      };
      transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
          return;
        }
      });
      transporter.close();

      res.json({ message: "Order ready to delivery" });
    } else res.json({ message: "Dish not found" });
    await connection.close();
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});
app.listen(process.env.PORT || 6002);
