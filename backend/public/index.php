<?php

require_once __DIR__ . '/../vendor/autoload.php';

use GraphQL\GraphQL;
use GraphQL\Type\Schema;
use Scandiweb\GraphQL\Types;
use Scandiweb\GraphQL\Resolvers\ProductResolver;
use Scandiweb\GraphQL\Resolvers\CartResolver;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

    if (!isset($input['query'])) {
        throw new \Exception('Query not provided in the request body.');
    }

    $query = $input['query'];
    $variables = $input['variables'] ?? null;

    $schema = new Schema([
        'query' => Types::product(), // Updated to use an existing method
        'mutation' => Types::mutation() // Ensure mutation() exists or remove this line
    ]);

    $result = GraphQL::executeQuery(
        $schema,
        $query,
        null,
        null,
        $variables
    );

    echo json_encode($result);
} catch (\Exception $e) {
    echo json_encode([
        'errors' => [
            [
                'message' => $e->getMessage()
            ]
        ]
    ]);
}