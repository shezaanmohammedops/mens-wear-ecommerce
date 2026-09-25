from datetime import datetime

from pydantic import BaseModel, Field


class OrderCreate(BaseModel):
    shipping_address: str = Field(min_length=10, max_length=1000)


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    product_price: float
    quantity: int
    subtotal: float


class OrderResponse(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: str
    payment_status: str
    shipping_address: str
    created_at: datetime
    updated_at: datetime | None = None
    items: list[OrderItemResponse]