<?php
$newsFile = __DIR__ . '/data/news.json';
$sitemapFile = __DIR__ . '/sitemap.xml';

$staticPages = [
  '/',
  '/about',
  '/coaches',
  '/news',
  '/teams',
  '/junior-group',
  '/middle-group',
  '/senior-group',
  '/privacy-policy'
];

$xml = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><urlset/>');
$xml->addAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

// Статичные страницы
foreach ($staticPages as $page) {
  $url = $xml->addChild('url');
  $url->addChild('loc', 'https://www.fczenit-schoolnn.ru' . $page);
}

// Новости
if (file_exists($newsFile)) {
  $news = json_decode(file_get_contents($newsFile), true);
  foreach ($news as $item) {
    if (!empty($item['id'])) {
      $url = $xml->addChild('url');
      $url->addChild('loc', 'https://www.fczenit-schoolnn.ru/news/' . $item['id']);
    }
  }
}

$xml->asXML($sitemapFile);
