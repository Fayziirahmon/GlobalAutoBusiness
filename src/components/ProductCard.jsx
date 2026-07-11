import { Link } from 'react-router-dom'
import { Icon } from './Icons'
import { useLang } from '../context/LanguageContext'

export default function ProductCard({ product }) {
  const { id, name, price, image, brand, rating, reviews, category } = product
  const { t, tl } = useLang()
  const title = tl(name)

  return (
    <Link to={`/product/${id}`} className="product-card">
      {/* Media */}
      <div className="product-card__media">
        <img src={image} alt={title} loading="lazy" className="product-card__img" />

        {category && <span className="product-card__chip">{t(`cat.${category}.name`, category)}</span>}

        {reviews > 0 && (
          <span className="product-card__rating">
            <Icon name="star" size={12} strokeWidth={1.5} /> {rating}
          </span>
        )}

        {/* Hover overlay */}
        <span className="product-card__overlay">
          View details <Icon name="arrow" size={15} />
        </span>
      </div>

      {/* Body */}
      <div className="product-card__body">
        {brand && <span className="product-card__brand">{brand}</span>}
        <h3 className="product-card__title">{title}</h3>

        <div className="product-card__foot">
          <div>
            <div className="product-card__price-label">{t('common.price')}</div>
            <div className="product-card__price" style={{ fontSize: price > 0 ? 20 : 15 }}>
              {price > 0 ? `$${price.toLocaleString()}` : t('common.onRequest')}
            </div>
          </div>
          <span className="product-card__btn" aria-hidden="true">
            <Icon name="arrow" size={17} />
          </span>
        </div>
      </div>
    </Link>
  )
}
