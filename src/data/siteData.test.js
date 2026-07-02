import { describe, expect, it } from 'vitest'
import { projects } from './siteData'

describe('siteData projects', () => {
  it('contains at least one project with required shape', () => {
    expect(Array.isArray(projects)).toBe(true)
    expect(projects.length).toBeGreaterThan(0)

    projects.forEach((project) => {
      expect(project.id).toBeTruthy()
      expect(project.name).toBeTruthy()
      expect(project.href).toMatch(/^\/work\//)
      expect(Array.isArray(project.tags)).toBe(true)
      expect(Array.isArray(project.features)).toBe(true)
      expect(project.deviceScreens?.desktop).toBeTruthy()
    })
  })

  it('has unique project ids', () => {
    const ids = projects.map((project) => project.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })
})

