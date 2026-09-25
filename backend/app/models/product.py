from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Float,
    Boolean,
    ForeignKey,
    DateTime,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(200), nullable=False, index=True)
    slug = Column(String(220), unique=True, nullable=False, index=True)

    description = Column(Text, nullable=True)

    price = Column(Float, nullable=False)
    discount_price = Column(Float, nullable=True)

    brand = Column(String(100), nullable=True)
    sku = Column(String(100), unique=True, nullable=False, index=True)

    image_url = Column(String(500), nullable=True)

    size = Column(String(50), nullable=True)
    color = Column(String(50), nullable=True)

    stock_quantity = Column(Integer, default=0, nullable=False)

    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)

    category_id = Column(
        Integer,
        ForeignKey("categories.id"),
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    category = relationship(
        "Category",
        backref="products",
    )