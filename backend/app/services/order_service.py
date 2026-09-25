from sqlalchemy.orm import Session, joinedload

from app.models.cart import Cart, CartItem
from app.models.order import Order, OrderItem
from app.models.product import Product


def create_order(
    db: Session,
    user_id: int,
    shipping_address: str,
):
    try:
        cart = (
            db.query(Cart)
            .options(
                joinedload(Cart.items).joinedload(CartItem.product)
            )
            .filter(Cart.user_id == user_id)
            .first()
        )

        if cart is None or not cart.items:
            raise ValueError("Cart is empty")

        total_amount = 0.0
        order_items = []

        for cart_item in cart.items:
            product = cart_item.product

            if product is None:
                raise ValueError(
                    f"Product {cart_item.product_id} not found"
                )

            if not product.is_active:
                raise ValueError(
                    f"Product {product.name} is no longer available"
                )

            if product.stock_quantity < cart_item.quantity:
                raise ValueError(
                    f"Not enough stock for {product.name}"
                )

            price = (
                product.discount_price
                if product.discount_price is not None
                else product.price
            )

            subtotal = price * cart_item.quantity
            total_amount += subtotal

            order_items.append(
                {
                    "product_id": product.id,
                    "product_name": product.name,
                    "product_price": price,
                    "quantity": cart_item.quantity,
                    "subtotal": subtotal,
                }
            )

        order = Order(
            user_id=user_id,
            total_amount=total_amount,
            status="pending",
            payment_status="pending",
            shipping_address=shipping_address,
        )

        db.add(order)
        db.flush()

        for item in order_items:
            db.add(
                OrderItem(
                    order_id=order.id,
                    product_id=item["product_id"],
                    product_name=item["product_name"],
                    product_price=item["product_price"],
                    quantity=item["quantity"],
                    subtotal=item["subtotal"],
                )
            )

            product = (
                db.query(Product)
                .filter(Product.id == item["product_id"])
                .first()
            )

            if product is None:
                raise ValueError(
                    f"Product {item['product_id']} not found"
                )

            product.stock_quantity -= item["quantity"]

        for cart_item in cart.items:
            db.delete(cart_item)

        db.commit()

        return (
            db.query(Order)
            .options(joinedload(Order.items))
            .filter(Order.id == order.id)
            .first()
        )

    except ValueError:
        db.rollback()
        raise

    except Exception:
        db.rollback()
        raise


def get_user_orders(
    db: Session,
    user_id: int,
):
    return (
        db.query(Order)
        .options(joinedload(Order.items))
        .filter(Order.user_id == user_id)
        .order_by(Order.created_at.desc())
        .all()
    )


def get_user_order(
    db: Session,
    user_id: int,
    order_id: int,
):
    return (
        db.query(Order)
        .options(joinedload(Order.items))
        .filter(
            Order.id == order_id,
            Order.user_id == user_id,
        )
        .first()
    )


def cancel_order(
    db: Session,
    user_id: int,
    order_id: int,
):
    try:
        order = get_user_order(
            db,
            user_id,
            order_id,
        )

        if order is None:
            raise ValueError("Order not found")

        if order.status != "pending":
            raise ValueError(
                "Only pending orders can be cancelled"
            )

        for item in order.items:
            product = (
                db.query(Product)
                .filter(Product.id == item.product_id)
                .first()
            )

            if product:
                product.stock_quantity += item.quantity

        order.status = "cancelled"

        db.commit()
        db.refresh(order)

        return order

    except ValueError:
        db.rollback()
        raise

    except Exception:
        db.rollback()
        raise