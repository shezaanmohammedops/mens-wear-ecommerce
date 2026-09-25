from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_admin
from app.database import get_db
from app.models.order import Order
from app.models.user import User
from app.services.admin_service import (
    get_all_orders,
    get_dashboard_stats,
    update_order_status,
)


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"],
)


@router.get("/dashboard")
def dashboard(
    _: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    return get_dashboard_stats(db)


@router.get("/orders")
def admin_orders(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
    _: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    return get_all_orders(
        db,
        skip=skip,
        limit=limit,
    )


@router.put("/orders/{order_id}/status")
def change_order_status(
    order_id: int,
    new_status: str,
    _: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if order is None:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    try:
        return update_order_status(
            db,
            order,
            new_status,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )