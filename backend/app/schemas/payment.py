from datetime import datetime

from pydantic import BaseModel, Field


class PaymentCreate(BaseModel):
    order_id: int
    payment_method: str = Field(
        default="online",
        min_length=2,
        max_length=50,
    )


class PaymentResponse(BaseModel):
    id: int
    order_id: int
    user_id: int
    amount: float
    payment_method: str
    status: str
    transaction_id: str | None = None
    created_at: datetime
    updated_at: datetime | None = None