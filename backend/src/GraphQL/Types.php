<?php

namespace Scandiweb\GraphQL;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\InputObjectType;

class Types
{
    private static array $types = [];

    public static function product(): ObjectType
    {
        return self::getType('Product', function () {
            return new ObjectType([
                'name' => 'Product',
                'fields' => [
                    'id' => Type::id(),
                    'sku' => Type::string(),
                    'name' => Type::string(),
                    'price' => Type::float(),
                    'type' => Type::string(),
                    'image' => Type::string(),
                    'inStock' => Type::boolean(),
                    'attributes' => Type::listOf(self::attribute())
                ]
            ]);
        });
    }

    public static function attribute(): ObjectType
    {
        return self::getType('Attribute', function () {
            return new ObjectType([
                'name' => 'Attribute',
                'fields' => [
                    'name' => Type::string(),
                    'value' => Type::string(),
                    'type' => Type::string(),
                    'items' => Type::listOf(self::attributeItem())
                ]
            ]);
        });
    }

    public static function attributeItem(): ObjectType
    {
        return self::getType('AttributeItem', function () {
            return new ObjectType([
                'name' => 'AttributeItem',
                'fields' => [
                    'id' => Type::id(),
                    'value' => Type::string(),
                    'displayValue' => Type::string()
                ]
            ]);
        });
    }

    public static function cartItem(): ObjectType
    {
        return self::getType('CartItem', function () {
            return new ObjectType([
                'name' => 'CartItem',
                'fields' => [
                    'id' => Type::id(),
                    'quantity' => Type::int(),
                    'product' => self::product()
                ]
            ]);
        });
    }

    public static function order(): ObjectType
    {
        return self::getType('Order', function () {
            return new ObjectType([
                'name' => 'Order',
                'fields' => [
                    'id' => Type::id(),
                    'totalAmount' => Type::float(),
                    'createdAt' => Type::string(),
                    'items' => Type::listOf(self::orderItem())
                ]
            ]);
        });
    }

    public static function orderItem(): ObjectType
    {
        return self::getType('OrderItem', function () {
            return new ObjectType([
                'name' => 'OrderItem',
                'fields' => [
                    'id' => Type::id(),
                    'product' => self::product(),
                    'quantity' => Type::int(),
                    'price' => Type::float()
                ]
            ]);
        });
    }

    public static function orderItemInput(): InputObjectType
    {
        return self::getType('OrderItemInput', function () {
            return new InputObjectType([
                'name' => 'OrderItemInput',
                'fields' => [
                    'productId' => Type::nonNull(Type::id()),
                    'quantity' => Type::nonNull(Type::int())
                ]
            ]);
        });
    }

    private static function getType(string $name, callable $typeFactory)
    {
        if (!isset(self::$types[$name])) {
            self::$types[$name] = $typeFactory();
        }

        return self::$types[$name];
    }
} 