import uuid

from sqlalchemy.orm import Session

from app.models.order import Order
from app.models.payment import Payment


ALLOWED_PAYMENT_METHODS = {
    "online",
    "cod",
}


def create_payment(
    db: Session,
    user_id: int,
    order_id: int,
    payment_method: str,
):
    payment_method = payment_method.strip().lower()

    if payment_method not in ALLOWED_PAYMENT_METHODS:
        raise ValueError(
            "Invalid payment method. Use 'online' or 'cod'"
        )

    try:
        order = (
            db.query(Order)
            .filter(
                Order.id == order_id,
                Order.user_id == user_id,
            )
            .first()
        )

        if order is None:
            raise ValueError("Order not found")

        if order.status == "cancelled":
            raise ValueError(
                "Cannot pay for a cancelled order"
            )

        if order.payment_status == "paid":
            raise ValueError(
                "Order is already paid"
            )

        existing_payment = (
            db.query(Payment)
            .filter(Payment.order_id == order_id)
            .first()
        )

        if existing_payment:
            raise ValueError(
                "Payment already exists for this order"
            )

        transaction_id = (
            f"TXN-{uuid.uuid4().hex[:16].upper()}"
        )

        payment_status = (
            "completed"
            if payment_method == "online"
            else "pending"
        )

        payment = Payment(
            order_id=order.id,
            user_id=user_id,
            amount=order.total_amount,
            payment_method=payment_method,
            status=payment_status,
            transaction_id=transaction_id,
        )

        db.add(payment)

        if payment_method == "online":
            order.payment_status = "paid"
            order.status = "confirmed"
        else:
            order.payment_status = "pending"
            order.status = "confirmed"

        db.commit()
        db.refresh(payment)

        return payment

    except ValueError:
        db.rollback()
        raise

    except Exception:
        db.rollback()
        raise


def get_payment(
    db: Session,
    user_id: int,
    payment_id: int,
):
    return (
        db.query(Payment)
        .filter(
            Payment.id == payment_id,
            Payment.user_id == user_id,
        )
        .first()
    )


def get_order_payment(
    db: Session,
    user_id: int,
    order_id: int,
):
    return (
        db.query(Payment)
        .filter(
            Payment.order_id == order_id,
            Payment.user_id == user_id,
        )
        .first()
    )