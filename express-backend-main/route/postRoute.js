import express from 'express';
import * as postController from '../controller/postController.js';
import isLoggedIn from '../util/authUtil.js';

const router = express.Router();

router.get('/posts',isLoggedIn, postController.getPosts);
router.get('/posts/:post_id/', isLoggedIn, postController.getPost);
router.get('/posts/like/:post_id/:detail', postController.getLike);
router.post('/posts', isLoggedIn, postController.writePost);
router.post('/posts/like/:post_id', isLoggedIn, postController.addLike);
router.patch('/posts/:post_id', isLoggedIn, postController.updatePost);
router.delete('/posts/:post_id', isLoggedIn, postController.softDeletePost);
router.delete('/posts/like/:post_id',isLoggedIn, postController.deleteLike)

export default router;
