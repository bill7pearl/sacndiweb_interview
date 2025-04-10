<?php

namespace Scandiweb\Model\Product;

class BookProduct extends AbstractProduct
{
    private float $weight;

    public function __construct(
        int $id,
        string $sku,
        string $name,
        float $price,
        float $weight
    ) {
        parent::__construct($id, $sku, $name, $price, 'book');
        $this->weight = $weight;
        $this->attributes = [
            'weight' => $weight
        ];
    }

    public function getWeight(): float
    {
        return $this->weight;
    }

    public function validate(): bool
    {
        return $this->weight > 0;
    }
} 