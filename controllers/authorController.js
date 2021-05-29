const formidable = require('formidable');
const { v4: uuidv4 } = require('uuid');
const fs = require("fs")
const { check, validationResult } = require("express-validator")
const Users = require("../models/User")
const Authors = require("../models/Authors")
const dateFormat = require('dateformat');
const authorForm = (req, res) => {
    res.render('createauthor', { title: 'Create new author', login: true, errors: [], input_title: '',input_author:'', body: '' })
}

const storePost1 = (req, res) => {

    const form1 = formidable();
    form1.parse(req, (err, fields, files) => {
        const errors = []
        const { title,author, body } = fields;
        if (title.length === 0) {
            errors.push({ msg: 'Authors name is required' })
        }
        if (author.length === 0) {
            errors.push({ msg: 'Title is required' })
        }
        if (body.length === 0) {
            errors.push({ msg: 'Body is required' })
        }
        const imageName1 = files.image.name;
        const split1 = imageName1.split1(".");
        const imageExt1 = split1[split1.length - 1].toUpperCase();
        if (files.image.name.length === 0) {
            errors.push({ msg: 'Image is required' })
        } else if (imageExt1 !== "JPG" && imageExt1 !== "PNG") {
            errors.push({ msg: 'Only jpg and png are allowed' })
        }

        if (errors.length !== 0) {
            res.render("createauthor", { title: 'Create new author', login: true, errors, input_title: title,input_author: author, body })
        } else {
            files.image.name = uuidv4() + "." + imageExt1;
            const oldPath1 = files.image.path
            const newPath1 = __dirname + "/../views/assets/img/" + files.image.name;
            fs.readFile(oldPath1, (err, data) => {
                if (!err) {
                    fs.writeFile(newPath1, data, (err) => {
                        if (!err) {
                            fs.unlink(oldPath1, async (err) => {
                                if (!err) {
                                    const id = req.id;
                                    try {
                                        const user1 = await Users.findOne({ _id: id })
                                        const name1 = user.name;
                                        const newAuthor1 = new Authors({
                                            userID: id,
                                            title,
                                            author,
                                            body,
                                            image: files.image.name,
                                            userName: name
                                        })
                                        try {
                                            const result1 = await newAuthor1.save();
                                            if (result1) {
                                                req.flash('success', "New Author has been added successfully")
                                                res.redirect('/authors/1')
                                            }
                                        } catch (err) {
                                            res.send(err.msg)
                                        }
                                    } catch (err) {
                                        res.send(err.msg);
                                    }
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}

const authors = async (req, res) => {
    const id = req.id;
    let currentPage1 = 1;
    let page1 = req.params.page1;
    if (page1) {
        currentPage1 = page1;
    }
    const perPage1 = 4;
    const skip1 = (currentPage1 - 1) * perPage1;
    const allAuthors = await authors.find({ userID: id })
        .skip(skip)
        .limit(perPage)
        .sort({ updatedAt: -1 });
    const count1 = await Authors.find({ userID: id }).countDocuments();
    res.render("Authors", { title: 'Authors', login: true, authors: allAuthors, formate: dateFormat, count1, perPage1, currentPage1 })
}

const details = async (req, res) => {
    const id = req.params.id;
    try {
        const details = await Authors.findOne({ _id: id });
        res.render('details', { title: 'Book details', login: true, details })
    } catch (err) {
        res.send(err)
    }
}

const updateForm = async (req, res) => {
    const id = req.params.id;
    try {
        const post = await Posts.findOne({ _id: id });
        res.render('update', { title: 'Update Post', login: true, errors: [], post });
    } catch (err) {
        res.send(err)
    }
}

const postValidations = [
    check('title').not().isEmpty().withMessage('Title is required'),
    check('body').not().isEmpty().withMessage('Body is required')
]

const postUpdate = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const id = req.body.hiddenID;
        const post = await Posts.findOne({ _id: id });
        res.render('update', { title: 'Update Post', login: true, errors: errors.array(), post });
    } else {
        const { hiddenID, title, body } = req.body;
        try {
            const updateResult = await Posts.findByIdAndUpdate(hiddenID, { title, body })
            if (updateResult) {
                req.flash('success', "Your book has been updated successfully")
                res.redirect('/posts/1')
            }
        } catch (err) {
            res.send(err)
        }
    }
}

const deletePost = async (req, res) => {
    const id = req.body.deleteID;
    try {
        const response = await Posts.findByIdAndRemove(id);
        if (response) {
            req.flash('success', "Your book has been deleted successfully")
            res.redirect('/posts/1')
        }
    } catch (err) {
        res.send(err)
    }
}

module.exports = {
    authorForm,
    storePost1,
    authors,
    details,
    updateForm,
    postUpdate,
    postValidations,
    deletePost
}