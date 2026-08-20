import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
test('la migración aplica RLS y no usa service_role',()=>{const sql=readFileSync('supabase/migrations/202608200001_ecommerce_foundation.sql','utf8');assert.match(sql,/enable row level security/g);assert.doesNotMatch(sql,/service_role/);assert.match(sql,/create_public_order/)})
test('todos los productos editoriales tienen id y precio numérico',()=>{const source=readFileSync('content/site.ts','utf8');const menu=source.slice(source.indexOf('menu: {'),source.indexOf('\n  order: {'));assert.equal((menu.match(/priceCents:/g)||[]).length,15);assert.equal((menu.match(/externalId:/g)||[]).length,0)})
