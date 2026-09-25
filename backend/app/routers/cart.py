from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.cart import (
    CartItemCreate,
    CartItemUpdate,
    CartResponse,
)
from app.services.cart_service import (
    add_to_cart,
    clear_cart,
    get_or_create_cart,
    remove_from_cart,
    update_cart_item,
)


router = APIRouter(
    prefix="/api/cart",
    tags=["Cart"],
)


@router.get(
    "",
    response_model=CartResponse,
)
def get_my_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_or_create_cart(
        db,
        current_user.id,
    )


@router.post(
    "/items",
    response_model=CartResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_cart_item(
    item_data: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return add_to_cart(
            db=db,
            user_id=current_user.id,
            product_id=item_data.product_id,
            quantity=item_data.quantity,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


@router.put(
    "/items/{item_id}",
    response_model=CartResponse,
)
def update_cart_item_quantity(
    item_id: int,
    item_data: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return update_cart_item(
            db=db,
            user_id=current_user.id,
            item_id=item_id,
            quantity=item_data.quantity,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


@router.delete(
    "/items/{item_id}",
    response_model=CartResponse,
)
def delete_cart_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return remove_from_cart(
            db=db,
            user_id=current_user.id,
            item_id=item_id,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )


@router.delete(
    "/clear",
    response_model=CartResponse,
)
def delete_all_cart_items(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return clear_cart(
        db=db,
        user_id=current_user.id,
    )