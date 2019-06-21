const { vol } = require('memfs')
const { readFileSync } = require('fs')
const path = require('path')
const {
  createTree,
  createDefsFromTree,
  createDefsFromFeatureSource,
  convert,
} = require('index')

describe('base', () => {
  const treeWithoutStrings = require('./fixtures/trees/withoutStrings.json')
  const treeWithStrings = require('./fixtures/trees/withStrings.json')
  const featureWithoutStrings = readFileSync(
    path.join(__dirname, './fixtures/features/withoutStrings.feature'),
    'utf8',
  )
  const featureWithStrings = readFileSync(
    path.join(__dirname, './fixtures/features/withStrings.feature'),
    'utf8',
  )

  beforeEach(() => {
    vol.reset()
    vol.fromJSON({
      'features/withoutStrings.feature': featureWithoutStrings,
      'features/withStrings.feature': featureWithStrings,
      defs: {},
    })
  })

  describe('createTree', () => {
    it('should create tree from feature sources', () => {
      expect(createTree(featureWithoutStrings)).toEqual(treeWithoutStrings)
      expect(createTree(featureWithStrings)).toEqual(treeWithStrings)
    })
  })

  describe('createDefsFromTree', () => {
    it('should correctly transform prepared steps tree', () => {
      expect(createDefsFromTree(treeWithoutStrings)).toMatchSnapshot()
      expect(createDefsFromTree(treeWithStrings)).toMatchSnapshot()
    })
  })

  describe('createDefsFromFeatureSource', () => {
    it('should correctly transform features sources to steps defs', () => {
      expect(
        createDefsFromFeatureSource(featureWithoutStrings),
      ).toMatchSnapshot()
      expect(createDefsFromFeatureSource(featureWithStrings)).toMatchSnapshot()
    })
  })

  describe('convert', () => {
    it('should do something', async () => {
      expect.assertions(2)

      await convert('features/withStrings.feature', 'defs')
      await convert('features/withoutStrings.feature', 'defs')

      expect(
        vol.readFileSync('defs/withoutStrings.js', 'utf8'),
      ).toMatchSnapshot()
      expect(vol.readFileSync('defs/withStrings.js', 'utf8')).toMatchSnapshot()
    })
  })
})
