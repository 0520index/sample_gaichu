<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as PHPMailerException;

require __DIR__ . '/mail_config.php';
require __DIR__ . '/PHPMailer-7.1.1/src/Exception.php';
require __DIR__ . '/PHPMailer-7.1.1/src/PHPMailer.php';
require __DIR__ . '/PHPMailer-7.1.1/src/SMTP.php';

$host     = 'mysql80.ez-tech.sakura.ne.jp'; // サーバー
$dbname   = 'ez-tech_contact_db';       // データベース
$user     = 'ez-tech_contact_db';               //ユーザ
$password = 'AdEkGJw6';       // 接続

try {
    $dsn = "mysql:host={$host};dbname={$dbname};charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);

    $name = trim($_POST['name'] ?? '');
    $tel = trim($_POST['tel'] ?? '');
    $mail = trim($_POST['email'] ?? '');
    $zip = trim($_POST['zip'] ?? '');
    $address = trim(($_POST['pref'] ?? '') . ($_POST['addr'] ?? ''));
    $type = $_POST['type'] ?? '';
    $message = trim($_POST['message'] ?? '');

    if (empty($name) || empty($tel) || empty($mail) || empty($zip) || empty($address)) {
        exit('必須項目が入力されていません。戻って入力してください。');
    }

    if (!filter_var($mail, FILTER_VALIDATE_EMAIL)) {
        exit('メールアドレスの形式が正しくありません。');
    }

    $sql = "INSERT INTO contact_data (name, tel, mail, zip, address, bird_type, message) 
            VALUES (:name, :tel, :mail, :zip, :address, :type, :message)";
    
    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':name'    => $name,
        ':tel'     => $tel,
        ':mail'    => $mail,
        ':zip'     => $zip,
        ':address' => $address,
        ':type'    => $type,
        ':message' => $message
    ]);

    // --- お客様への自動返信メール送信（BCCに運営陣） ---
    $subject_user = '【害虫レスキュー侍】お問い合わせを承りました';

    $body_user = $name . " 様\n\n";
    $body_user .= "この度はお問い合わせいただき、誠にありがとうございます。\n";
    $body_user .= "以下の内容で送信を承りました。担当者より改めてご連絡いたします。\n\n";
    $body_user .= "--------------------------------------------------\n";
    $body_user .= "【お名前】: " . $name . "\n";
    $body_user .= "【電話番号】: " . $tel . "\n";
    $body_user .= "【メール】: " . $mail . "\n";
    $body_user .= "【〒】: " . $zip . "\n";
    $body_user .= "【住所】: " . $address . "\n";
    $body_user .= "【鳥の種類】: " . $type . "\n";
    $body_user .= "【内容】: \n" . $message . "\n";
    $body_user .= "--------------------------------------------------\n";
    $body_user .= "※もしお心当たりがない場合は、恐れ入りますがこちらのメールは破棄してください。";

    $mailer = new PHPMailer(true);
    $mailer->CharSet = 'UTF-8';
    $mailer->Encoding = 'base64';

    if (MAIL_USE_SMTP) {
        $mailer->isSMTP();
        $mailer->Host = MAIL_SMTP_HOST;
        $mailer->SMTPAuth = true;
        $mailer->Username = MAIL_SMTP_USER;
        $mailer->Password = MAIL_SMTP_PASS;
        $mailer->SMTPSecure = MAIL_SMTP_SECURE;
        $mailer->Port = MAIL_SMTP_PORT;
    } else {
        $mailer->isMail();
    }

    $mailer->setFrom(MAIL_FROM_EMAIL, MAIL_FROM_NAME);
    $mailer->Sender = MAIL_FROM_EMAIL;
    $mailer->addAddress($mail, $name);
    foreach (MAIL_BCC as $bcc) {
        $mailer->addBCC($bcc);
    }
    $mailer->addReplyTo(MAIL_FROM_EMAIL, MAIL_FROM_NAME);
    $mailer->Subject = $subject_user;
    $mailer->Body = $body_user;

    try {
        $mailer->send();
    } catch (PHPMailerException $e) {
        exit('メールの送信に失敗しました。お手数ですがお電話にてお問い合わせください。');
    }
    // --- ここまで ---

    echo "<h1>送信完了</h1>";
    echo "<p>お問い合わせいただきありがとうございます。
担当者よりご連絡いたしますので、少々お待ちいただけますと幸いです。</p>";
    echo "<a href='index.html'>トップページに戻る</a>";

} catch (PDOException $e) {
    exit('エラーが発生しました：' . $e->getMessage());
}
?>