import express from 'express';
import { UrlController } from '../controllers/UrlController';

const router = express.Router();

router.post('/shorturls', UrlController.createShortUrl);
router.get('/shorturls/:shortcode', UrlController.getUrlStats);
router.get('/:shortcode', UrlController.redirectUrl);

export default router;
