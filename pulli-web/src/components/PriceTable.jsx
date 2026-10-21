import { formatPrice, hasSizes } from '../lib/catalogue.js'
import './PriceTable.css'

const UNIT = { mm: 'mm', inch: '', pin: '' }

export const sizeLabel = (p, s) => (/^\d+$/.test(s) && UNIT[p.sizeUnit] ? `${s} ${UNIT[p.sizeUnit]}` : s)

// Finish rows x size columns, exactly as in the printed price list.
// Clicking a price cell selects that finish and size.
export default function PriceTable({ product: p, finishIndex, sizeIndex, onSelect }) {
  const sized = hasSizes(p)
  const cols = sized ? p.sizes : ['Price']
  return (
    <div className="price-table-wrap">
      <table className="price-table">
        <thead>
          <tr>
            <th scope="col">Finish</th>
            {cols.map((s) => (
              <th key={s} scope="col">
                {sized ? sizeLabel(p, s) : s}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {p.prices.map((row, fi) => (
            <tr key={row.finish + fi} className={fi === finishIndex ? 'is-row' : ''}>
              <th scope="row">{row.finish}</th>
              {cols.map((_, si) => {
                const v = row.values[si]
                const active = fi === finishIndex && (si === sizeIndex || !sized)
                return (
                  <td key={si}>
                    <button
                      className={active ? 'is-active' : ''}
                      disabled={v == null}
                      onClick={() => onSelect(fi, si)}
                    >
                      {v == null ? '-' : formatPrice(v)}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
