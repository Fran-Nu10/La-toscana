'use client'

import { useMemo, useState, type FormEvent } from 'react'
import { useCommerce } from '../CommerceProvider'
import type { Product, ProductOption } from '@/data/types'
import { formatUyu } from '@/lib/order'
import { Field, Icons, MoneyInput, Select, Switch, TextArea, TextInput, EmptyState } from './ui'
import styles from './admin.module.css'

const slug = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const emptyProduct = (categoryId: string): Product => ({
  id: '',
  categoryId,
  name: '',
  description: '',
  priceCents: 0,
  available: true,
  options: [],
})

export function ProductsPanel({ onSaved }: { onSaved: (message: string) => void }) {
  const commerce = useCommerce()
  const [editing, setEditing] = useState<Product | null>(null)
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return commerce.products.filter((product) => {
      const byCategory = categoryFilter === 'all' || product.categoryId === categoryFilter
      const byName = !needle || product.name.toLowerCase().includes(needle)
      return byCategory && byName
    })
  }, [commerce.products, query, categoryFilter])

  const categoryName = (id: string) =>
    commerce.categories.find((category) => category.id === id)?.name ?? 'Sin categoría'

  if (editing) {
    return (
      <ProductEditor
        product={editing}
        categories={commerce.categories}
        onCancel={() => setEditing(null)}
        onSave={(product) => {
          commerce.saveProduct(product)
          setEditing(null)
          onSaved('Producto guardado')
        }}
      />
    )
  }

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Productos</h1>
          <p className={styles.pageSubtitle}>
            {commerce.products.length} en la carta ·{' '}
            {commerce.products.filter((product) => !product.available).length} ocultos
          </p>
        </div>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={() => setEditing(emptyProduct(commerce.categories[0]?.id ?? ''))}
        >
          {Icons.plus}
          Nuevo producto
        </button>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.search}>
          <span className={styles.searchIcon}>{Icons.search}</span>
          <TextInput
            type="search"
            value={query}
            placeholder="Buscar un producto…"
            aria-label="Buscar productos por nombre"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <Select
          value={categoryFilter}
          aria-label="Filtrar por categoría"
          onChange={(event) => setCategoryFilter(event.target.value)}
        >
          <option value="all">Todas las categorías</option>
          {commerce.categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={Icons.box}
          title={commerce.products.length ? 'Ningún producto coincide' : 'La carta está vacía'}
          text={
            commerce.products.length
              ? 'Probá con otro nombre o cambiá la categoría del filtro.'
              : 'Agregá el primer plato para que empiece a aparecer en la carta pública.'
          }
        />
      ) : (
        <ul className={styles.rows}>
          {visible.map((product) => (
            <li key={product.id} className={styles.row}>
              <div className={styles.rowMain}>
                <div className={styles.rowTitle}>{product.name}</div>
                <div className={styles.rowMeta}>
                  <span className={styles.rowPrice}>{formatUyu(product.priceCents)}</span>
                  <span className={styles.dot} aria-hidden="true" />
                  <span>{categoryName(product.categoryId)}</span>
                  {product.options.length > 0 && (
                    <>
                      <span className={styles.dot} aria-hidden="true" />
                      <span>
                        {product.options.length}{' '}
                        {product.options.length === 1 ? 'opción' : 'opciones'}
                      </span>
                    </>
                  )}
                  {!product.available && <span className={`${styles.tag} ${styles.tagOff}`}>Oculto</span>}
                </div>
              </div>
              <div className={styles.rowActions}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSmall}`}
                  onClick={() => setEditing(product)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className={styles.iconBtn}
                  aria-label={`Eliminar ${product.name}`}
                  onClick={() => {
                    if (confirm(`¿Eliminar ${product.name}?`)) {
                      commerce.deleteProduct(product.id)
                      onSaved('Producto eliminado')
                    }
                  }}
                >
                  {Icons.trash}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

/* ── Editor ────────────────────────────────────────────────────────────────
   Los textos van por FormData (sin re-render por tecla) y lo que necesita
   verse al instante — disponible, opciones, variantes — vive en estado. */

function ProductEditor({
  product,
  categories,
  onSave,
  onCancel,
}: {
  product: Product
  categories: { id: string; name: string }[]
  onSave: (product: Product) => void
  onCancel: () => void
}) {
  const [available, setAvailable] = useState(product.available)
  const [options, setOptions] = useState<ProductOption[]>(product.options)
  const isNew = !product.id

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name')).trim()
    onSave({
      ...product,
      id: product.id || `${slug(name)}-${Date.now()}`,
      categoryId: String(form.get('categoryId')),
      name,
      description: String(form.get('description')).trim(),
      priceCents: Math.round(Number(form.get('price')) * 100),
      available,
      options,
    })
  }

  const updateOption = (index: number, option: ProductOption) =>
    setOptions((current) => current.map((item, i) => (i === index ? option : item)))

  return (
    <form onSubmit={submit}>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>{isNew ? 'Nuevo producto' : product.name}</h1>
          <p className={styles.pageSubtitle}>
            {isNew ? 'Se agrega a la carta al guardar' : 'Editando un producto de la carta'}
          </p>
        </div>
      </div>

      <div className={styles.stack}>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <h2 className={styles.cardTitle}>Datos del producto</h2>
          </div>
          <div className={`${styles.cardPad} ${styles.stack}`}>
            <Field label="Nombre">
              <TextInput name="name" defaultValue={product.name} required autoFocus={isNew} />
            </Field>
            <Field label="Descripción" hint="Se muestra debajo del nombre en la carta.">
              <TextArea name="description" defaultValue={product.description} rows={3} />
            </Field>
            <div className={styles.grid2}>
              <Field label="Categoría">
                <Select name="categoryId" defaultValue={product.categoryId}>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Precio">
                <MoneyInput name="price" defaultValue={product.priceCents / 100} required />
              </Field>
            </div>
            <Switch
              label="Disponible"
              hint={available ? 'Se puede pedir desde la carta' : 'Queda oculto para los clientes'}
              checked={available}
              onChange={setAvailable}
            />
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHead}>
            <div>
              <h2 className={styles.cardTitle}>Opciones y variantes</h2>
              <p className={styles.cardNote}>Salsas, tamaños, guarniciones y sus adicionales.</p>
            </div>
          </div>
          <div className={`${styles.cardPad} ${styles.stack}`}>
            {options.length === 0 && (
              <p className={styles.hint}>
                Este producto se pide tal cual, sin elecciones. Agregá una opción si el cliente
                tiene que elegir algo.
              </p>
            )}

            {options.map((option, index) => (
              <fieldset className={styles.option} key={option.id}>
                <div className={styles.optionHead}>
                  <TextInput
                    aria-label="Nombre de la opción"
                    value={option.name}
                    onChange={(event) =>
                      updateOption(index, { ...option, name: event.target.value })
                    }
                  />
                  <button
                    type="button"
                    className={styles.iconBtn}
                    aria-label={`Quitar la opción ${option.name}`}
                    onClick={() => setOptions((current) => current.filter((_, i) => i !== index))}
                  >
                    {Icons.trash}
                  </button>
                </div>

                <Switch
                  label="Obligatoria"
                  hint="El cliente no puede pedir sin elegir."
                  checked={option.required}
                  onChange={(required) => updateOption(index, { ...option, required })}
                />

                {option.choices.map((choice, choiceIndex) => (
                  <div className={styles.choice} key={choice.id}>
                    <TextInput
                      aria-label="Nombre de la variante"
                      value={choice.name}
                      onChange={(event) =>
                        updateOption(index, {
                          ...option,
                          choices: option.choices.map((item, i) =>
                            i === choiceIndex ? { ...item, name: event.target.value } : item,
                          ),
                        })
                      }
                    />
                    <MoneyInput
                      aria-label={`Adicional de ${choice.name}`}
                      value={choice.priceDeltaCents / 100}
                      onChange={(event) =>
                        updateOption(index, {
                          ...option,
                          choices: option.choices.map((item, i) =>
                            i === choiceIndex
                              ? { ...item, priceDeltaCents: Number(event.target.value) * 100 }
                              : item,
                          ),
                        })
                      }
                    />
                    <button
                      type="button"
                      className={styles.iconBtn}
                      aria-label={`Quitar la variante ${choice.name}`}
                      onClick={() =>
                        updateOption(index, {
                          ...option,
                          choices: option.choices.filter((_, i) => i !== choiceIndex),
                        })
                      }
                    >
                      {Icons.trash}
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSmall}`}
                  onClick={() =>
                    updateOption(index, {
                      ...option,
                      choices: [
                        ...option.choices,
                        {
                          id: `choice-${Date.now()}`,
                          name: 'Nueva variante',
                          priceDeltaCents: 0,
                          available: true,
                        },
                      ],
                    })
                  }
                >
                  {Icons.plus}
                  Agregar variante
                </button>
              </fieldset>
            ))}

            <button
              type="button"
              className={styles.btn}
              onClick={() =>
                setOptions((current) => [
                  ...current,
                  { id: `option-${Date.now()}`, name: 'Nueva opción', required: false, choices: [] },
                ])
              }
            >
              {Icons.plus}
              Agregar opción
            </button>
          </div>
        </div>
      </div>

      <div className={styles.saveBar}>
        <button type="button" className={styles.btn} onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
          Guardar producto
        </button>
      </div>
    </form>
  )
}
