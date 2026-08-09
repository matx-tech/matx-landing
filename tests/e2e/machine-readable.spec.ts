import { expect, test } from '@playwright/test';

const PROHIBITED_PHRASES = [
  'täielik kooskõla',
  'A+ usaldusskoor',
  '99.9% uptime',
  'garanteeritud',
  '2.3× kiirem',
  'säästa 10 tundi',
  'EU AI Act — täielik kooskõla',
  'NIS2 vastavus',
  'Iga neljas ebaõnnestub',
  '1.9× nõudlus-pakkumise lõhe',
  'Olemasolevad ei tööta',
] as const;

const SITE_URL = 'https://matx.ee';

test.describe('machine-readable files', () => {
  test('GET /llms.txt returns 200 with expected content @p0', async ({ request }) => {
    const res = await request.get('/llms.txt');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toMatch(/^text\/plain/);
    const body = await res.text();
    expect(body).toContain(SITE_URL);
    expect(body).toContain('# MATx');
    for (const phrase of PROHIBITED_PHRASES) {
      expect(body).not.toContain(phrase);
    }
  });

  test('GET /robots.txt references sitemap @p0', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('/sitemap.xml');
  });

  test('GET /sitemap.xml lists all expected routes @p0', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain(SITE_URL);
    expect(body).toContain(SITE_URL + '/tehniline');
    expect(body).toContain(SITE_URL + '/privaatsus');
    expect(body).toContain(SITE_URL + '/tingimused');
    expect(body).toContain(SITE_URL + '/gdpr');
  });

  test('GET / returns OG metadata in HTML head @p0', async ({ request }) => {
    const res = await request.get('/');
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toMatch(/<meta[^>]*property="og:title"[^>]*>/);
    expect(html).toMatch(/<meta[^>]*property="og:description"[^>]*>/);
    expect(html).toMatch(/<meta[^>]*name="twitter:card"[^>]*>/);
  });
});
