from sqlalchemy.orm import Session

from app.models.order import Order
from app.models.product import Product
from app.models.user import User


def get_dashboard_stats(db: Session):
    total_users = db.query(User).count()
    total_products = db.query(Product).count()
    total_orders = db.query(Order).count()

    total_revenue = (
        db.query(Order)
        .filter(Order.payment_status == "paid")
        .with_entities(Order.total_amount)
        .all()
    )

    revenue = sum(
        float(row[0])
        for row in total_revenue
        if row[0] is not None
    )

    return {
        "total_users": total_users,
        "total_products": total_products,
        "total_orders": total_orders,
        "total_revenue": revenue,
    }


def get_all_orders(
    db: Session,
    skip: int = 0,
    limit: int = 50,
):
    return (
        db.query(Order)
        .order_by(Order.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def update_order_status(
    db: Session,
    order: Order,
    new_status: str,
):
    allowed_statuses = {
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
    }

    if new_status not in allowed_statuses:
        raise ValueError("Invalid order status")

    order.status = new_status

    db.commit()
    db.refresh(order)

    return order