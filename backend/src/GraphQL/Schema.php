<?php

namespace Scandiweb\GraphQL;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema as GraphQLSchema;

class Schema
{
    private static ?GraphQLSchema $instance = null;

    public static function getInstance(): GraphQLSchema
    {
        if (self::$instance === null) {
            self::$instance = new GraphQLSchema([
                'query' => new ObjectType([
                    'name' => 'Query',
                    'fields' => [
                        'products' => [
                            'type' => Type::listOf(Types::product()),
                            'resolve' => function ($root, $args) {
                                return ProductResolver::getProducts();
                            }
                        ],
                        'product' => [
                            'type' => Types::product(),
                            'args' => [
                                'id' => Type::nonNull(Type::id())
                            ],
                            'resolve' => function ($root, $args) {
                                return ProductResolver::getProduct($args['id']);
                            }
                        ],
                        'cart' => [
                            'type' => Type::listOf(Types::cartItem()),
                            'resolve' => function ($root, $args) {
                                return CartResolver::getCartItems();
                            }
                        ]
                    ]
                ]),
                'mutation' => new ObjectType([
                    'name' => 'Mutation',
                    'fields' => [
                        'addToCart' => [
                            'type' => Types::cartItem(),
                            'args' => [
                                'productId' => Type::nonNull(Type::id()),
                                'quantity' => Type::nonNull(Type::int())
                            ],
                            'resolve' => function ($root, $args) {
                                return CartResolver::addToCart($args['productId'], $args['quantity']);
                            }
                        ],
                        'updateCartItem' => [
                            'type' => Types::cartItem(),
                            'args' => [
                                'itemId' => Type::nonNull(Type::id()),
                                'quantity' => Type::nonNull(Type::int())
                            ],
                            'resolve' => function ($root, $args) {
                                return CartResolver::updateCartItem($args['itemId'], $args['quantity']);
                            }
                        ],
                        'removeCartItem' => [
                            'type' => Type::boolean(),
                            'args' => [
                                'itemId' => Type::nonNull(Type::id())
                            ],
                            'resolve' => function ($root, $args) {
                                return CartResolver::removeCartItem($args['itemId']);
                            }
                        ],
                        'createOrder' => [
                            'type' => Types::order(),
                            'args' => [
                                'items' => Type::nonNull(Type::listOf(Type::nonNull(Types::orderItemInput())))
                            ],
                            'resolve' => function ($root, $args) {
                                return OrderResolver::createOrder($args['items']);
                            }
                        ]
                    ]
                ])
            ]);
        }

        return self::$instance;
    }
} 