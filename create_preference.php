<?php
// ==================================================================================
//                            INITIAL CONFIGURATION
// ==================================================================================

// 1. Load the libraries installed by Composer (Required!)
// Requires the 'vendor/' folder created in the next step.
require __DIR__ . '/vendor/autoload.php';

use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\MercadoPagoConfig;

// 🛑 SECRET KEY: Your Mercado Pago Access Token
// THIS VALUE MUST BE YOUR REAL PRODUCTION OR TEST TOKEN.
$access_token = 'APP_USR-5837998060821264-102513-1754dd09943cc57aa1eb687aa622e884-1397114700';

if (empty($access_token)) {
    http_response_code(500);
    echo json_encode(["error" => "Mercado Pago Access Token not configured."]);
    exit;
}

// 2. Initialize the Mercado Pago client
MercadoPagoConfig::setAccessToken($access_token);
$client = new PreferenceClient();

// ==================================================================================
//                    ⚡ YOUR SECURE PRICE "DATABASE" ⚡
// ==================================================================================
// Define the currency you will use: UYU (Uruguay), ARS (Argentina), USD, BRL, etc.
$DEFAULT_CURRENCY_ID = 'UYU'; // 🛑 CHANGE THIS IF YOU USE A DIFFERENT CURRENCY

$masterPriceList = [
    // ID: [ 'name' => name, 'price' => price (in UYU) ]
    '1'  => ['name' => 'High-Waist Stretch Jeans',          'price' => 998.00],
    '2'  => ['name' => 'Animal Print Dress',                 'price' => 998.00],
    '3'  => ['name' => 'Linen Vest',                         'price' => 998.00],
    '4'  => ['name' => 'Trunk-Style Handbag',                'price' => 3598.00],
    '5'  => ['name' => 'Classic Handbag',                    'price' => 3298.00],
    '6'  => ['name' => 'Stretch Trousers',                   'price' => 998.00],
    '7'  => ['name' => 'Classic Trousers',                   'price' => 998.00],
    '8'  => ['name' => 'Denim Jeans',                        'price' => 998.00],
    '9'  => ['name' => 'Linen Trousers',                     'price' => 998.00],
    '10' => ['name' => 'Gabardine Trousers',                 'price' => 998.00],
    '11' => ['name' => 'Cotton Trousers',                    'price' => 998.00],
    '12' => ['name' => 'Embroidered Prili Dress',            'price' => 1598.00],
    '13' => ['name' => 'Cotton Dress',                       'price' => 1598.00],
    '14' => ['name' => 'Summer Cotton Dress',                'price' => 1598.00],
    '15' => ['name' => 'Italian Top',                        'price' => 1598.00],
    '16' => ['name' => 'Linen & Cotton Tee',                 'price' => 1598.00],
    '17' => ['name' => 'Short-Sleeve Linen & Cotton Tee',   'price' => 1598.00],
    '18' => ['name' => 'Italian Long-Sleeve Top',            'price' => 1598.00],
    '19' => ['name' => 'Leather Belts',                      'price' => 3298.00],
    '20' => ['name' => 'Mini Purse',                         'price' => 3298.00],
];

// ==================================================================================
//                           POST ENDPOINT LOGIC
// ==================================================================================

// 3. Configure to receive the JSON request
header('Content-Type: application/json');

// Receive the JSON from the POST request body
$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);

// Get the client's cart
$clientCart = $data['cart'] ?? null;

if (empty($clientCart)) {
    http_response_code(400);
    echo json_encode(["error" => "The cart is empty or malformed."]);
    exit;
}

try {
    $itemsForMP = [];
    $serverCalculatedTotal = 0;

    foreach ($clientCart as $item) {
        $itemId = $item['id'] ?? null;
        $quantity = $item['quantity'] ?? null;

        $masterProduct = $masterPriceList[$itemId] ?? null;

        // 🛑 SECURITY CHECK
        if (!$masterProduct || !is_numeric($quantity) || $quantity <= 0) {
            error_log("Payment attempt with invalid cart data: " . $itemId . " / " . $quantity);
            http_response_code(400);
            echo json_encode(["error" => "The cart contains invalid products or quantities."]);
            exit;
        }

        // 4. Ensure the correct item structure
        $itemsForMP[] = [
            'id' => (string)$itemId,
            'title' => $masterProduct['name'],
            'unit_price' => (float)$masterProduct['price'],
            'quantity' => (int)$quantity,
            'currency_id' => $DEFAULT_CURRENCY_ID,
        ];

        $serverCalculatedTotal += $masterProduct['price'] * $quantity;
    }

    // 5. Create the payment preference
    $preferenceData = [
        'items' => $itemsForMP,
        'payer' => [
            'name' => 'Buyer',
            'surname' => 'Test',
            'email' => 'julipuchala@gmail.com',
        ],
        // 🚨 Redirect Configuration 🚨
        'back_urls' => [
            'success' => "https://franciscopuchala.github.io/layout-de-la-pagina/success.html",
            'failure' => "https://franciscopuchala.github.io/layout-de-la-pagina/failure.html",
            'pending' => "https://franciscopuchala.github.io/layout-de-la-pagina/pending.html",
        ],
    ];

    // Use the SDK client to create the preference
    $result = $client->create($preferenceData);

    // 6. Respond to the frontend with the ID and redirect URL
    http_response_code(200);
    echo json_encode([
        'id' => $result->id,
        'init_point' => $result->init_point // 🟢 KEY: Mercado Pago URL
    ]);

} catch (\Exception $e) {
    // SDK error handling
    error_log('🔴 CRITICAL ERROR creating preference: ' . $e->getMessage());

    $error_message = $e->getMessage();
    if (strpos($error_message, 'Invalid credentials') !== false || strpos($error_message, '401') !== false) {
        http_response_code(500);
        echo json_encode(["error" => "Authentication failed. Check your Access Token.", "details" => $error_message]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "There was an internal server error: " . $error_message]);
    }
}

?>
