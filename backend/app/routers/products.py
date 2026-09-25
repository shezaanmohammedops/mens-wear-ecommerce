from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_admin
from app.database import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate
from app.services.product_service import (
    create_product,
    delete_product,
    get_product,
    get_products,
    update_product,
)


router = APIRouter(
    prefix="/api/products",
    tags=["Products"],
)


# Upload directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/jpg": ".jpg",
}


def save_image(image: UploadFile) -> str:
    if image.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPG, JPEG, PNG and WEBP images are allowed",
        )

    extension = ALLOWED_IMAGE_TYPES[image.content_type]
    filename = f"{uuid4().hex}{extension}"
    file_path = UPLOAD_DIR / filename

    with file_path.open("wb") as buffer:
        while chunk := image.file.read(1024 * 1024):
            buffer.write(chunk)

    return f"/uploads/{filename}"


@router.get(
    "",
    response_model=list[ProductResponse],
)
def list_products(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return get_products(
        db,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/{product_id}",
    response_model=ProductResponse,
)
def get_single_product(
    product_id: int,
    db: Session = Depends(get_db),
):
    product = get_product(db, product_id)

    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    return product


@router.post(
    "",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_product(
    name: str,
    slug: str,
    price: float,
    sku: str,
    category_id: int,
    description: str | None = None,
    discount_price: float | None = None,
    brand: str | None = None,
    size: str | None = None,
    color: str | None = None,
    stock_quantity: int = 0,
    is_active: bool = True,
    is_featured: bool = False,
    image: UploadFile | None = File(default=None),
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    image_url = None

    if image is not None:
        image_url = save_image(image)

    product_data = ProductCreate(
        name=name,
        slug=slug,
        description=description,
        price=price,
        discount_price=discount_price,
        brand=brand,
        sku=sku,
        image_url=image_url,
        size=size,
        color=color,
        stock_quantity=stock_quantity,
        is_active=is_active,
        is_featured=is_featured,
        category_id=category_id,
    )

    try:
        return create_product(db, product_data)

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


@router.put(
    "/{product_id}",
    response_model=ProductResponse,
)
def edit_product(
    product_id: int,
    name: str,
    slug: str,
    price: float,
    sku: str,
    category_id: int,
    description: str | None = None,
    discount_price: float | None = None,
    brand: str | None = None,
    size: str | None = None,
    color: str | None = None,
    stock_quantity: int = 0,
    is_active: bool = True,
    is_featured: bool = False,
    image: UploadFile | None = File(default=None),
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    product = get_product(db, product_id)

    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    image_url = product.image_url

    if image is not None:
        image_url = save_image(image)

    product_data = ProductUpdate(
        name=name,
        slug=slug,
        description=description,
        price=price,
        discount_price=discount_price,
        brand=brand,
        sku=sku,
        image_url=image_url,
        size=size,
        color=color,
        stock_quantity=stock_quantity,
        is_active=is_active,
        is_featured=is_featured,
        category_id=category_id,
    )

    try:
        return update_product(
            db,
            product,
            product_data,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


@router.delete(
    "/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_product(
    product_id: int,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    product = get_product(db, product_id)

    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    delete_product(db, product)

    return None