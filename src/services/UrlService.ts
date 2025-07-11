import { UrlModel, IUrl, IClick } from '../models/UrlModel';
import { nanoid } from 'nanoid';
import Log from '../../../Logging Middleware/logger';

export class UrlService {
  private static generateShortcode(): string {
    return nanoid(8);
  }

  private static async isShortcodeExists(shortcode: string): Promise<boolean> {
    const existing = await UrlModel.findOne({ shortcode });
    return !!existing;
  }

  private static async generateUniqueShortcode(): Promise<string> {
    let shortcode: string;
    do {
      shortcode = this.generateShortcode();
    } while (await this.isShortcodeExists(shortcode));
    return shortcode;
  }

  private static mockLocation(): string {
    const locations = ['New York, US', 'London, UK', 'Tokyo, JP', 'Sydney, AU', 'Berlin, DE'];
    return locations[Math.floor(Math.random() * locations.length)];
  }

  public static async createShortUrl(
    originalUrl: string,
    validityMinutes: number = 30,
    customShortcode?: string
  ): Promise<{ shortcode: string; expiresAt: Date }> {
    try {
      let shortcode: string;

      if (customShortcode) {
        if (await this.isShortcodeExists(customShortcode)) {
          throw new Error('Custom shortcode already exists');
        }
        shortcode = customShortcode;
      } else {
        shortcode = await this.generateUniqueShortcode();
      }

      const expiresAt = new Date(Date.now() + validityMinutes * 60 * 1000);

      const url = new UrlModel({
        originalUrl,
        shortcode,
        expiresAt
      });

      await url.save();

      await Log('UrlService', 'INFO', 'url-shortener', `Created short URL: ${shortcode}`);

      return { shortcode, expiresAt };
    } catch (error) {
      await Log('UrlService', 'ERROR', 'url-shortener', `Failed to create short URL: ${error.message}`);
      throw error;
    }
  }

  public static async getUrlStats(shortcode: string): Promise<any> {
    try {
      const url = await UrlModel.findOne({ shortcode });

      if (!url) {
        throw new Error('Short URL not found');
      }

      const stats = {
        originalUrl: url.originalUrl,
        shortcode: url.shortcode,
        createdAt: url.createdAt.toISOString(),
        expiresAt: url.expiresAt.toISOString(),
        isExpired: url.expiresAt < new Date(),
        totalClicks: url.clicks.length,
        clicks: url.clicks.map(click => ({
          timestamp: click.timestamp.toISOString(),
          referrer: click.referrer,
          location: click.location,
          userAgent: click.userAgent
        }))
      };

      await Log('UrlService', 'INFO', 'url-shortener', `Retrieved stats for: ${shortcode}`);

      return stats;
    } catch (error) {
      await Log('UrlService', 'ERROR', 'url-shortener', `Failed to get stats: ${error.message}`);
      throw error;
    }
  }

  public static async redirectUrl(
    shortcode: string,
    referrer?: string,
    userAgent?: string
  ): Promise<string> {
    try {
      const url = await UrlModel.findOne({ shortcode });

      if (!url) {
        throw new Error('Short URL not found');
      }

      if (url.expiresAt < new Date()) {
        throw new Error('Short URL has expired');
      }

      const clickData: IClick = {
        timestamp: new Date(),
        referrer: referrer || null,
        location: this.mockLocation(),
        userAgent: userAgent || null
      };

      url.clicks.push(clickData);
      await url.save();

      await Log('UrlService', 'INFO', 'url-shortener', `Redirected: ${shortcode} to ${url.originalUrl}`);

      return url.originalUrl;
    } catch (error) {
      await Log('UrlService', 'ERROR', 'url-shortener', `Failed to redirect: ${error.message}`);
      throw error;
    }
  }
}
