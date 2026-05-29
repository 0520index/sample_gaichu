<?php
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

    // --- ここから 管理者への通知メール送信 ---

    mb_language("Japanese");
    mb_internal_encoding("UTF-8");

    $to      = "info@rescue-samurai.com";
    $subject = "【害虫レスキュー侍】サイトからお問い合わせがありました";
    
    $body = "サイトから新しいお問い合わせがありました。\n\n";
    $body .= "--------------------------------------------------\n";
    $body .= "【お名前】: " . $name . "\n";
    $body .= "【電話番号】: " . $tel . "\n";
    $body .= "【メール】: " . $mail . "\n";
    $body .= "【〒】: " . $zip . "\n";
    $body .= "【住所】: " . $address . "\n";
    $body .= "【鳥の種類】: " . $type . "\n";
    $body .= "【内容】: \n" . $message . "\n";
    $body .= "--------------------------------------------------\n";
    $body .= "早めのご対応をお願いします。";

$from_email = "postmaster@rescue-samurai.com";
$header  = "From: " . $from_email . "\r\n";
$header .= "Cc: \r\n";
$header .= "Reply-To: " . $mail . "\r\n";
$header .= "X-Mailer: PHP/" . phpversion();

$additional_params = "-f " . $from_email;

mb_send_mail($to, $subject, $body, $header, $additional_params);
    // --- ここまで ---

// --- ここから お客様への自動返信メール送信（BCCに従業員） ---

    $subject_user = "【害虫レスキュー侍】お問い合わせを承りました";
    
    $body_user = $name . " 様\n\n";
    $body_user .= "この度はお問い合わせいただき、誠にありがとうございます。\n";
    $body_user .= "以下の内容で送信を承りました。担当者より改めてご連絡いたします。\n\n";
    $body_user .= "--------------------------------------------------\n";
    $body_user .= "【お名前】: " . $name . "\n";
    $body_user .= "【お問い合わせ内容】: \n" . $message . "\n";
    $body_user .= "--------------------------------------------------\n\n";
    $body_user .= "※このメールは送信専用です。心当たりがない場合は破棄してください。";

    $header_user  = "From: " . $to . "\r\n";
    $header_user .= "Bcc: info@rescue-samurai.com\r\n"; // BCC
    $header_user .= "Reply-To: " . $to . "\r\n";
    $header_user .= "X-Mailer: PHP/" . phpversion();

    mb_send_mail($mail, $subject_user, $body_user, $header_user, $additional_params);

    // --- ここまで ---

    echo "<h1>送信完了</h1>";
    echo "<p>お問い合わせいただきありがとうございます。
担当者よりご連絡いたしますので、少々お待ちいただけますと幸いです。</p>";
    echo "<a href='index.html'>トップページに戻る</a>";

} catch (PDOException $e) {
    exit('エラーが発生しました：' . $e->getMessage());
}
?>