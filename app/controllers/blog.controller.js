const db = require("../models");
const config = require("../config/auth.config");
const Blog = db.blog;
const Op = db.Sequelize.Op;
// var dateFormat = require('dateformat');

exports.allBlogsTitle = (req, res) => {
  Blog.findAll().then((blogs) => {
    console.log(typeof(blogs))
    var titles = [];
    blogs.forEach((value) => {
      titles.push(value.title);
    });
    var filteredBlogPosts = blogs.filter(blog => blog.id == req.body.id)[0];
    res.status(200).send({titles:titles,blog:filteredBlogPosts});
  })
  .catch((error) => {
    console.log(error);
  });
};
