<?php

namespace Scandiweb\Model\Product;

abstract class AbstractProduct
{
    protected int $id;
    protected string $sku;
    protected string $name;
    protected float $price;
    protected string $type;
    protected array $attributes = [];

    public function __construct(
        int $id,
        string $sku,
        string $name,
        float $price,
        string $type,
        array $attributes = []
    ) {
        $this->id = $id;
        $this->sku = $sku;
        $this->name = $name;
        $this->price = $price;
        $this->type = $type;
        $this->attributes = $attributes;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getSku(): string
    {
        return $this->sku;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getPrice(): float
    {
        return $this->price;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function getAttributes(): array
    {
        return $this->attributes;
    }

    abstract public function validate(): bool;
} 