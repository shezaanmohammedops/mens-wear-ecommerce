from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ProductBase(BaseModel):
    name: str
    slug: str
    description: str | None = None

    price: float = Field(gt=0)
    discount_price: float | None = Field(default=None, gt=0)

    brand: str | None = None
    sku: str

    image_url: str | None = None

    size: str | None = None
    color: str | None = None

    stock_quantity: int = Field(default=0, ge=0)

    is_active: bool = True
    is_featured: bool = False

    category_id: int


class ProductCreate(ProductBase):
    pass


class ProductUpdate(ProductBase):
    pass


class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)