import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { works } from '../src/projects/registry.js'
import { connectedProjects } from '../src/projects/connectedProjects.js'

test('six original works have bilingual, accurately scoped access', () => {
  assert.equal(connectedProjects.length, 6)
  for (const work of connectedProjects) {
    assert.equal(works.filter(w => w.slug === work.slug).length, 1)
    for (const key of ['tagline', 'blurb', 'interaction', 'availability']) {
      assert.ok(work[key].zh)
      assert.ok(work[key].en)
    }
    assert.equal(work.type, 'project')
    assert.equal(work.poster, undefined)
    if (work.access === 'public') {
      assert.equal(work.url, 'https://livematch-weekend-club.wangziyanryan0816.chatgpt.site/')
    } else assert.equal(work.url, undefined)
  }
  assert.equal(connectedProjects.find(w => w.slug === 'seatcompare').access, 'extension')
  assert.notEqual(connectedProjects.find(w => w.slug === 'f1-race-lab').kind.en, connectedProjects.find(w => w.slug === 'pit-wall-panic').kind.en)
})

test('published detail component includes no local preview or machine paths', () => {
  const detail = readFileSync(new URL('../src/projects/ConnectedProject.jsx', import.meta.url), 'utf8')
  assert.doesNotMatch(detail, /__local-projects|localhost|127\.0\.0\.1|\/Users\//)
  assert.match(detail, /work\.access === 'public'/)
  assert.match(detail, /href="#\/lab"/)
})
