<?php
/**
 * メール送信設定（PHPMailer）
 *
 * さくらのレンタルサーバ等では MAIL_USE_SMTP を true にし、
 * ドメインメールの SMTP 情報を設定してください。
 */
define('MAIL_FROM_EMAIL', 'info@rescue-samurai.com');
define('MAIL_FROM_NAME', '害虫レスキュー侍');
define('MAIL_BCC', ['info@rescue-samurai.com', '31075hk@gmail.com']);

// false: サーバーの mail() 経由 / true: SMTP 認証送信（推奨）
define('MAIL_USE_SMTP', false);
define('MAIL_SMTP_HOST', 'mysql80.ez-tech.sakura.ne.jp');           // 例: xxx.sakura.ne.jp
define('MAIL_SMTP_PORT', 587);
define('MAIL_SMTP_USER', 'ez-tech_contact_db');           // 例: info@rescue-samurai.com
define('MAIL_SMTP_PASS', 'AdEkGJw6');
define('MAIL_SMTP_SECURE', 'tls');      // 'tls' または 'ssl'
