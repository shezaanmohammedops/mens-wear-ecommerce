from sqlalchemy.orm import Session, joinedload

from app.models.cart import Cart, CartItem
from app.models.product import Product


def get_or_create_cart(
    db: Session,
    user_id: int,
):
    cart = (
        db.query(Cart)
        .options(
            joinedload(Cart.items).joinedload(CartItem.product)
        )
        .filter(Cart.user_id == user_id)
        .first()
    )

    if cart is None:
        cart = Cart(user_id=user_id)

        db.add(cart)
        db.commit()
        db.refresh(cart)

    return cart


def get_cart(
    db: Session,
    user_id: int,
):
    return (
        db.query(Cart)
        .options(
            joinedload(Cart.items).joinedload(CartItem.product)
        )
        .filter(Cart.user_id == user_id)
        .first()
    )


def add_to_cart(
    db: Session,
    user_id: int,
    product_id: int,
    quantity: int,
):
    product = (
        db.query(Product)
        .filter(
            Product.id == product_id,
            Product.is_active == True,
        )
        .first()
    )

    if product is None:
        raise ValueError("Product not found")

    if product.stock_quantity < quantity:
        raise ValueError("Not enough stock")

    cart = get_or_create_cart(db, user_id)

    cart_item = (
        db.query(CartItem)
        .filter(
            CartItem.cart_id == cart.id,
            CartItem.product_id == product_id,
        )
        .first()
    )

    if cart_item:
        new_quantity = cart_item.quantity + quantity

        if product.stock_quantity < new_quantity:
            raise ValueError("Not enough stock")

        cart_item.quantity = new_quantity

    else:
        cart_item = CartItem(
            cart_id=cart.id,
            product_id=product_id,
            quantity=quantity,
        )

        db.add(cart_item)

    db.commit()

    return get_cart(db, user_id)


def update_cart_item(
    db: Session,
    user_id: int,
    item_id: int,
    quantity: int,
):
    cart = get_cart(db, user_id)

    if cart is None:
        raise ValueError("Cart not found")

    cart_item = (
        db.query(CartItem)
        .filter(
            CartItem.id == item_id,
            CartItem.cart_id == cart.id,
        )
        .first()
    )

    if cart_item is None:
        raise ValueError("Cart item not found")

    if cart_item.product.stock_quantity < quantity:
        raise ValueError("Not enough stock")

    cart_item.quantity = quantity

    db.commit()

    return get_cart(db, user_id)


def remove_from_cart(
    db: Session,
    user_id: int,
    item_id: int,
):
    cart = get_cart(db, user_id)

    if cart is None:
        raise ValueError("Cart not found")

    cart_item = (
        db.query(CartItem)
        .filter(
            CartItem.id == item_id,
            CartItem.cart_id == cart.id,
        )
        .first()
    )

    if cart_item is None:
        raise ValueError("Cart item not found")

    db.delete(cart_item)
    db.commit()

    return get_cart(db, user_id)


def clear_cart(
    db: Session,
    user_id: int,
):
    cart = get_cart(db, user_id)

    if cart is None:
        return None

    for item in cart.items:
        db.delete(item)

    db.commit()

    return get_cart(db, user_id)