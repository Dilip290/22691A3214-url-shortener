import { Request, Response } from 'express';
import { UrlService } from '../services/UrlService';
import { validateCreateUrl, validateShortcode } from '../utils/validators';
import Log from '../../../Logging Middleware/logger';

export class UrlController {
  public static async createShortUrl(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = validateCreateUrl(req.body);
      
      if (error) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.details.map(detail => detail.message)
        });
        return;
      }

      const { originalUrl, validityMinutes, customShortcode } = value;

      const result = await UrlService.createShortUrl(originalUrl, validityMinutes, customShortcode);

      res.status(201).json({
        success: true,
        shortcode: result.shortcode,
        shortUrl: `${req.protocol}://${req.get('host')}/${result.shortcode}`,
        originalUrl,
        expiresAt: result.expiresAt.toISOString()
      });
    } catch (error) {
      await Log('UrlController', 'ERROR', 'url-shortener', `Create URL error: ${error.message}`);
      
      if (error.message === 'Custom shortcode already exists') {
        res.status(409).json({
          error: 'Custom shortcode already exists',
          message: 'Please choose a different shortcode'
        });
      } else {
        res.status(500).json({
          error: 'Internal server error',
          message: 'Failed to create short URL'
        });
      }
    }
  }

  public static async getUrlStats(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = validateShortcode(req.params.shortcode);
      
      if (error) {
        res.status(400).json({
          error: 'Invalid shortcode format'
        });
        return;
      }

      const stats = await UrlService.getUrlStats(value);

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      await Log('UrlController', 'ERROR', 'url-shortener', `Get stats error: ${error.message}`);
      
      if (error.message === 'Short URL not found') {
        res.status(404).json({
          error: 'Short URL not found'
        });
      } else {
        res.status(500).json({
          error: 'Internal server error',
          message: 'Failed to retrieve URL stats'
        });
      }
    }
  }

  public static async redirectUrl(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = validateShortcode(req.params.shortcode);
      
      if (error) {
        res.status(400).json({
          error: 'Invalid shortcode format'
        });
        return;
      }

      const referrer = req.get('Referrer');
      const userAgent = req.get('User-Agent');

      const originalUrl = await UrlService.redirectUrl(value, referrer, userAgent);

      res.redirect(302, originalUrl);
    } catch (error) {
      await Log('UrlController', 'ERROR', 'url-shortener', `Redirect error: ${error.message}`);
      
      if (error.message === 'Short URL not found') {
        res.status(404).json({
          error: 'Short URL not found'
        });
      } else if (error.message === 'Short URL has expired') {
        res.status(410).json({
          error: 'Short URL has expired'
        });
      } else {
        res.status(500).json({
          error: 'Internal server error',
          message: 'Failed to redirect'
        });
      }
    }
  }
}
