<?php

namespace Scandiweb\GraphQL\Resolvers;

use Scandiweb\Config\Database;

class CartResolver
{
    public static function getCartItems(): array
    {
        $db = Database::getInstance();
        $stmt = $db->query('
            SELECT ci.*, p.*, pa.attribute_name, pa.attribute_value
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            LEFT JOIN product_attributes pa ON p.id = pa.product_id
            ORDER BY ci.id
        ');
        $items = $stmt->fetchAll();

        $result = [];
        $currentItem = null;

        foreach ($items as $item) {
            if (!$currentItem || $currentItem['id'] !== $item['id']) {
                if ($currentItem) {
                    $result[] = self::mapCartItem($currentItem);
                }
                $currentItem = $item;
                $currentItem['attributes'] = [];
            }

            if ($item['attribute_name']) {
                $currentItem['attributes'][] = [
                    'name' => $item['attribute_name'],
                    'value' => $item['attribute_value']
                ];
            }
        }

        if ($currentItem) {
            $result[] = self::mapCartItem($currentItem);
        }

        return $result;
    }

    public static function addToCart(string $productId, int $quantity): array
    {
        $db = Database::getInstance();
        $db->beginTransaction();

        try {
            // Check if product exists and is in stock
            $stmt = $db->prepare('SELECT * FROM products WHERE id = ? AND in_stock = 1');
            $stmt->execute([$productId]);
            $product = $stmt->fetch();

            if (!$product) {
                throw new \RuntimeException('Product not found or out of stock');
            }

            // Check if item already in cart
            $stmt = $db->prepare('SELECT * FROM cart_items WHERE product_id = ?');
            $stmt->execute([$productId]);
            $existingItem = $stmt->fetch();

            if ($existingItem) {
                $newQuantity = $existingItem['quantity'] + $quantity;
                $stmt = $db->prepare('UPDATE cart_items SET quantity = ? WHERE id = ?');
                $stmt->execute([$newQuantity, $existingItem['id']]);
                $itemId = $existingItem['id'];
            } else {
                $stmt = $db->prepare('
                    INSERT INTO cart_items (product_id, quantity)
                    VALUES (?, ?)
                ');
                $stmt->execute([$productId, $quantity]);
                $itemId = $db->lastInsertId();
            }

            $db->commit();

            return self::getCartItem($itemId);
        } catch (\Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }

    public static function updateCartItem(string $itemId, int $quantity): array
    {
        $db = Database::getInstance();
        $db->beginTransaction();

        try {
            $stmt = $db->prepare('UPDATE cart_items SET quantity = ? WHERE id = ?');
            $stmt->execute([$quantity, $itemId]);

            if ($stmt->rowCount() === 0) {
                throw new \RuntimeException('Cart item not found');
            }

            $db->commit();

            return self::getCartItem($itemId);
        } catch (\Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }

    public static function removeCartItem(string $itemId): bool
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('DELETE FROM cart_items WHERE id = ?');
        $stmt->execute([$itemId]);

        return $stmt->rowCount() > 0;
    }

    private static function getCartItem(string $itemId): array
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('
            SELECT ci.*, p.*, pa.attribute_name, pa.attribute_value
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            LEFT JOIN product_attributes pa ON p.id = pa.product_id
            WHERE ci.id = ?
        ');
        $stmt->execute([$itemId]);
        $items = $stmt->fetchAll();

        if (empty($items)) {
            throw new \RuntimeException('Cart item not found');
        }

        $item = $items[0];
        $item['attributes'] = [];

        foreach ($items as $row) {
            if ($row['attribute_name']) {
                $item['attributes'][] = [
                    'name' => $row['attribute_name'],
                    'value' => $row['attribute_value']
                ];
            }
        }

        return self::mapCartItem($item);
    }

    private static function mapCartItem(array $data): array
    {
        return [
            'id' => $data['id'],
            'quantity' => (int) $data['quantity'],
            'product' => [
                'id' => $data['product_id'],
                'sku' => $data['sku'],
                'name' => $data['name'],
                'price' => (float) $data['price'],
                'type' => $data['type'],
                'image' => $data['image'] ?? '',
                'inStock' => (bool) $data['in_stock'],
                'attributes' => $data['attributes'] ?? []
            ]
        ];
    }
} 