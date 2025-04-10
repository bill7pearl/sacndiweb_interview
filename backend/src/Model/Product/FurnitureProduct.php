<?php

namespace Scandiweb\Model\Product;

class FurnitureProduct extends AbstractProduct
{
    private float $height;
    private float $width;
    private float $length;

    public function __construct(
        int $id,
        string $sku,
        string $name,
        float $price,
        float $height,
        float $width,
        float $length
    ) {
        parent::__construct($id, $sku, $name, $price, 'furniture');
        $this->height = $height;
        $this->width = $width;
        $this->length = $length;
        $this->attributes = [
            'height' => $height,
            'width' => $width,
            'length' => $length
        ];
    }

    public function getHeight(): float
    {
        return $this->height;
    }

    public function getWidth(): float
    {
        return $this->width;
    }

    public function getLength(): float
    {
        return $this->length;
    }

    public function validate(): bool
    {
        return $this->height > 0 && $this->width > 0 && $this->length > 0;
    }
} 