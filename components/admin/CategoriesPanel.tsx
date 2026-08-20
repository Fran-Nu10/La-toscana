'use client'

import { useState } from 'react'
import { useCommerce } from '../CommerceProvider'
import type { Category } from '@/data/types'
import { Icons, Switch, TextInput } from './ui'
import styles from './admin.module.css'

const slug = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/**
 * Categorías: una fila por categoría, con el nombre editable en línea, el
 * interruptor de visibilidad que guarda solo, y Guardar habilitado únicamente
 * cuando el nombre realmente cambió.
 */
export function CategoriesPanel({ onSaved }: { onSaved: (message: string) => void }) {
  const commerce = useCommerce()
  const [draft, setDraft] = useState('')

  function addCategory() {
    const name = draft.trim()
    if (!name) return
    commerce.saveCategory({ id: `${slug(name)}-${Date.now()}`, name, available: true })
    setDraft('')
    onSaved('Categoría agregada')
  }

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Categorías</h1>
          <p className={styles.pageSubtitle}>
            El orden y la visibilidad con la que se agrupan los platos en la carta.
          </p>
        </div>
      </div>

      <ul className={styles.rows}>
        {commerce.categories.map((category) => (
          <CategoryRow
            key={category.id}
            category={category}
            productCount={
              commerce.products.filter((product) => product.categoryId === category.id).length
            }
            onSave={(next) => {
              commerce.saveCategory(next)
              onSaved('Categoría guardada')
            }}
            onDelete={() => {
              if (confirm(`¿Eliminar ${category.name} y sus productos?`)) {
                commerce.deleteCategory(category.id)
                onSaved('Categoría eliminada')
              }
            }}
          />
        ))}
      </ul>

      <div className={`${styles.card} ${styles.cardPad}`} style={{ marginTop: 12 }}>
        <div className={styles.stack}>
          <div>
            <h2 className={styles.cardTitle}>Agregar una categoría</h2>
            <p className={styles.cardNote}>Por ejemplo: Entradas, Sin TACC, Bebidas sin alcohol.</p>
          </div>
          <div className={styles.addRow}>
            <TextInput
              value={draft}
              placeholder="Nombre de la categoría"
              aria-label="Nombre de la nueva categoría"
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  addCategory()
                }
              }}
            />
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
              disabled={!draft.trim()}
              onClick={addCategory}
            >
              {Icons.plus}
              Agregar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function CategoryRow({
  category,
  productCount,
  onSave,
  onDelete,
}: {
  category: Category
  productCount: number
  onSave: (category: Category) => void
  onDelete: () => void
}) {
  const [name, setName] = useState(category.name)
  const dirty = name.trim() !== category.name && name.trim().length > 0

  return (
    <li className={`${styles.row} ${styles.categoryRow}`}>
      <div className={styles.rowMain}>
        <TextInput
          value={name}
          aria-label={`Nombre de la categoría ${category.name}`}
          onChange={(event) => setName(event.target.value)}
        />
        <div className={styles.rowMeta}>
          <span>
            {productCount} {productCount === 1 ? 'producto' : 'productos'}
          </span>
          {!category.available && <span className={`${styles.tag} ${styles.tagOff}`}>Oculta</span>}
        </div>
      </div>

      <div className={styles.categoryControls}>
        {/* La visibilidad guarda al instante: es el cambio más frecuente. */}
        <Switch
          label="Visible"
          checked={category.available}
          onChange={(available) => onSave({ ...category, available })}
        />
        <div className={styles.rowActions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnSmall}`}
            disabled={!dirty}
            onClick={() => onSave({ ...category, name: name.trim() })}
          >
            Guardar
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label={`Eliminar ${category.name}`}
            onClick={onDelete}
          >
            {Icons.trash}
          </button>
        </div>
      </div>
    </li>
  )
}
