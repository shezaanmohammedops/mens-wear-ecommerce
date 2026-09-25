from sqlalchemy.orm import Session

from app.models.category import Category
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


def get_products(
    db: Session,
    skip: int = 0,
    limit: int = 20,
):
    return (
        db.query(Product)
        .filter(Product.is_active == True)
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_product(
    db: Session,
    product_id: int,
):
    return (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )


def create_product(
    db: Session,
    product_data: ProductCreate,
):
    existing_slug = (
        db.query(Product)
        .filter(Product.slug == product_data.slug)
        .first()
    )

    if existing_slug:
        raise ValueError("Product slug already exists")

    existing_sku = (
        db.query(Product)
        .filter(Product.sku == product_data.sku)
        .first()
    )

    if existing_sku:
        raise ValueError("Product SKU already exists")

    category = (
        db.query(Category)
        .filter(Category.id == product_data.category_id)
        .first()
    )

    if category is None:
        raise ValueError("Category not found")

    product = Product(**product_data.model_dump())

    db.add(product)
    db.commit()
    db.refresh(product)

    return product


def update_product(
    db: Session,
    product: Product,
    product_data: ProductUpdate,
):
    existing_slug = (
        db.query(Product)
        .filter(
            Product.slug == product_data.slug,
            Product.id != product.id,
        )
        .first()
    )

    if existing_slug:
        raise ValueError("Product slug already exists")

    existing_sku = (
        db.query(Product)
        .filter(
            Product.sku == product_data.sku,
            Product.id != product.id,
        )
        .first()
    )

    if existing_sku:
        raise ValueError("Product SKU already exists")

    category = (
        db.query(Category)
        .filter(Category.id == product_data.category_id)
        .first()
    )

    if category is None:
        raise ValueError("Category not found")

    for field, value in product_data.model_dump().items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)

    return product


def delete_product(
    db: Session,
    product: Product,
):
    db.delete(product)
    db.commit()