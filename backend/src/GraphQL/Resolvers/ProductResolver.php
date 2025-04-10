<?php

namespace Scandiweb\GraphQL\Resolvers;

use Scandiweb\Model\Product\AbstractProduct;
use Scandiweb\Model\Product\BookProduct;
use Scandiweb\Model\Product\FurnitureProduct;
use Scandiweb\Config\Database;

class ProductResolver
{
    public static function getProducts(): array
    {
        $db = Database::getInstance();
        $stmt = $db->query('SELECT * FROM products');
        $products = $stmt->fetchAll();

        $result = [];
        foreach ($products as $product) {
            $result[] = self::mapProduct($product);
        }

        return $result;
    }

    public static function getProduct(string $id): ?array
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM products WHERE id = ?');
        $stmt->execute([$id]);
        $product = $stmt->fetch();

        if (!$product) {
            return null;
        }

        return self::mapProduct($product);
    }

    private static function mapProduct(array $data): array
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM product_attributes WHERE product_id = ?');
        $stmt->execute([$data['id']]);
        $attributes = $stmt->fetchAll();

        $mappedAttributes = [];
        foreach ($attributes as $attribute) {
            $mappedAttributes[] = [
                'name' => $attribute['attribute_name'],
                'value' => $attribute['attribute_value']
            ];
        }

        return [
            'id' => $data['id'],
            'sku' => $data['sku'],
            'name' => $data['name'],
            'price' => (float) $data['price'],
            'type' => $data['type'],
            'image' => $data['image'] ?? '',
            'inStock' => (bool) $data['in_stock'],
            'attributes' => $mappedAttributes
        ];
    }

    public static function createProduct(array $data): AbstractProduct
    {
        $db = Database::getInstance();
        $db->beginTransaction();

        try {
            $stmt = $db->prepare('
                INSERT INTO products (sku, name, price, type, image, in_stock)
                VALUES (?, ?, ?, ?, ?, ?)
            ');
            $stmt->execute([
                $data['sku'],
                $data['name'],
                $data['price'],
                $data['type'],
                $data['image'] ?? null,
                $data['inStock'] ?? true
            ]);

            $productId = $db->lastInsertId();

            foreach ($data['attributes'] as $attribute) {
                $stmt = $db->prepare('
                    INSERT INTO product_attributes (product_id, attribute_name, attribute_value)
                    VALUES (?, ?, ?)
                ');
                $stmt->execute([
                    $productId,
                    $attribute['name'],
                    $attribute['value']
                ]);
            }

            $db->commit();

            return self::createProductInstance($data['type'], [
                'id' => $productId,
                'sku' => $data['sku'],
                'name' => $data['name'],
                'price' => $data['price'],
                'attributes' => $data['attributes']
            ]);
        } catch (\Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }

    private static function createProductInstance(string $type, array $data): AbstractProduct
    {
        switch ($type) {
            case 'book':
                return new BookProduct(
                    $data['id'],
                    $data['sku'],
                    $data['name'],
                    $data['price'],
                    (float) $data['attributes']['weight']
                );
            case 'furniture':
                return new FurnitureProduct(
                    $data['id'],
                    $data['sku'],
                    $data['name'],
                    $data['price'],
                    (float) $data['attributes']['height'],
                    (float) $data['attributes']['width'],
                    (float) $data['attributes']['length']
                );
            default:
                throw new \InvalidArgumentException("Invalid product type: $type");
        }
    }
} 